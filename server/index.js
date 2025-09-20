import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';

// Persistence mode: "json" or "memory" (default: memory)
const PERSIST_MODE = (process.env.PERSIST_MODE || 'memory').toLowerCase();
const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const STATE_FILE = path.join(DATA_DIR, 'state.json');

/**
 * App state shape
 * {
 *   leads: Lead[],
 *   tours: Tour[],
 *   bookings: Booking[],
 *   invoices: Invoice[],
 *   messages: { id, phone, direction: 'in'|'out', text, timestamp }[],
 *   availability: Record<string, string[]>
 * }
 * Each Lead/Tour/Booking carries: eventType='Wedding', guestCount=75, cateringType='outside'
 */

let state = null;

const DEFAULT_EVENT = {
	eventType: 'Wedding',
	guestCount: 75,
	cateringType: 'outside',
};

function formatDateYYYYMMDD(date) {
 	const year = date.getFullYear();
 	const month = String(date.getMonth() + 1).padStart(2, '0');
 	const day = String(date.getDate()).padStart(2, '0');
 	return `${year}-${month}-${day}`;
}

// tiny internal parser for later Twilio use
function parseDateKeywordOrISO(input) {
	if (!input) return null;
	const lower = String(input).toLowerCase();
	if (lower === 'today') {
		return formatDateYYYYMMDD(new Date());
	}
	if (lower === 'tomorrow') {
		const d = new Date();
		d.setDate(d.getDate() + 1);
		return formatDateYYYYMMDD(d);
	}
	// accept YYYY-MM-DD pass-through
	if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
	return null;
}

// Normalize time to 24h HH:mm
function normalizeTimeTo24h(input) {
	if (!input) return null;
	const s = String(input).trim();
	// Already HH:mm 24h
	const m24 = s.match(/^(\d{1,2}):(\d{2})$/);
	if (m24) {
		let h = parseInt(m24[1], 10);
		const min = parseInt(m24[2], 10);
		if (h >= 0 && h <= 23 && min >= 0 && min <= 59) {
			return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
		}
	}
	// 12h like 1:05 pm or 01:05PM
	const m12 = s.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
	if (m12) {
		let h12 = parseInt(m12[1], 10);
		const min12 = parseInt(m12[2], 10);
		const mer = m12[3].toLowerCase();
		if (h12 >= 1 && h12 <= 12 && min12 >= 0 && min12 <= 59) {
			let h24 = h12 % 12;
			if (mer === 'pm') h24 += 12;
			return `${String(h24).padStart(2, '0')}:${String(min12).padStart(2, '0')}`;
		}
	}
	return null;
}

// Format HH:mm (24h) to h:mm AM/PM
function formatTimeTo12h(hhmm) {
    if (!hhmm) return '';
    const m = String(hhmm).match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return hhmm;
    let h = parseInt(m[1], 10);
    const min = m[2];
    const mer = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return min === '00' ? `${h}${mer}` : `${h}:${min}${mer}`;
}

// Convert 12-hour format back to 24-hour HH:mm for internal processing
function parse12hTo24h(time12) {
    if (!time12) return null;
    const m = String(time12).match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
    if (!m) return null;
    let h = parseInt(m[1], 10);
    const min = m[2] || '00';
    const mer = m[3].toLowerCase();
    if (h === 12) h = 0;
    if (mer === 'pm') h += 12;
    return `${String(h).padStart(2, '0')}:${min}`;
}

function seedState() {
 	const times = ['10am','11:30am','1pm','3pm','4:30pm'];
 	const today = new Date();
 	const plusDays = (n) => {
 		const d = new Date(today);
 		d.setDate(d.getDate() + n);
 		return formatDateYYYYMMDD(d);
 	};

 	const availability = {};
 	[0, 1, 2, 3, 7].forEach((n) => {
 		availability[plusDays(n)] = times.slice();
 	});

	const nowIso = new Date().toISOString();
	const demoLead = {
		id: 'lead_demo_1',
		name: 'Isabella & Mateo',
		phone: '+12145551234',
		...DEFAULT_EVENT,
		createdAt: nowIso,
	};

	const seededLeads = [
		{
			id: 'lead_1',
			name: 'Sajid Memon',
			phone: '+12142773806',
			...DEFAULT_EVENT,
			createdAt: nowIso,
		},
		{
			id: 'lead_2',
			name: 'Haroon Memon',
			phone: '+19729002244',
			...DEFAULT_EVENT,
			createdAt: nowIso,
		},
		demoLead,
	];

	const seededTours = [
		{
			id: 'tour_demo_1',
			leadId: demoLead.id,
			leadName: demoLead.name,
			date: plusDays(3),
			time: '13:00',
			status: 'scheduled',
			createdAt: nowIso,
			...DEFAULT_EVENT,
		},
	];

	return {
		leads: seededLeads,
		tours: seededTours,
		bookings: [],
		invoices: [],
		messages: [],
		availability,
	};
}

function ensureDataDir() {
 	if (!fs.existsSync(DATA_DIR)) {
 		fs.mkdirSync(DATA_DIR, { recursive: true });
 	}
}

function loadFromDiskOrSeed() {
 	ensureDataDir();
 	if (fs.existsSync(STATE_FILE)) {
 		try {
 			const raw = fs.readFileSync(STATE_FILE, 'utf-8');
 			const parsed = JSON.parse(raw);
 			// minimal validation
 			if (parsed && typeof parsed === 'object') {
 				return parsed;
 			}
 		} catch (err) {
 			console.warn('[state] Failed to read/parse state.json, reseeding...', err);
 		}
 	}
 	const seeded = seedState();
 	saveToDisk(seeded);
 	return seeded;
}

function saveToDisk(currentState) {
 	ensureDataDir();
 	const tmpPath = `${STATE_FILE}.tmp`;
 	const json = JSON.stringify(currentState, null, 2);
 	fs.writeFileSync(tmpPath, json, 'utf-8');
 	fs.renameSync(tmpPath, STATE_FILE);
}

export function getState() {
 	return state;
}

export function save() {
 	if (PERSIST_MODE === 'json') {
 		saveToDisk(state);
 	}
}

export function mutate(updaterFn) {
 	if (typeof updaterFn !== 'function') return;
 	updaterFn(state);
 	if (PERSIST_MODE === 'json') {
 		save();
 	}
}

// Initialize state
if (PERSIST_MODE === 'json') {
 	state = loadFromDiskOrSeed();
 	console.log('[state] Persistence mode: json');
} else {
 	state = seedState();
 	console.log('[state] Persistence mode: memory');
}

const app = express();
const PORT = process.env.PORT || 4000;

// Twilio sends application/x-www-form-urlencoded by default
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Simple request logging for /api/* routes
app.use((req, _res, next) => {
	if (req.path.startsWith('/api/')) {
		console.log(`[api] ${req.method} ${req.path}`);
	}
	next();
});

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

// Expose read-only snapshot of state
app.get('/api/state', (req, res) => {
	const { leads, tours, bookings, invoices, messages, availability } = getState();
	return res.status(200).json({ leads, tours, bookings, invoices, messages, availability });
});

// Availability lookup by date
app.get('/api/availability', (req, res) => {
	const raw = (req.query.date ?? '').toString();
	const parsed = parseDateKeywordOrISO(raw);
	const dateYmd = parsed || formatDateYYYYMMDD(new Date());
	const slots = (getState().availability && getState().availability[dateYmd]) || [];
	return res.status(200).json({ date: dateYmd, slots });
});

// Reset demo state to fresh seed, then persist in json mode
app.post('/api/reset', (req, res) => {
	state = seedState();
	save();
	const { leads, tours, bookings, messages, availability } = getState();
	return res.status(200).json({ ok: true, leads, tours, bookings, messages, availability });
});

// Simulate a website visitor requesting the pricing guide
app.post('/api/simulate/pricing-guide', (req, res) => {
	const body = req.body || {};
	const resolvedName = (body.name || 'Guest').trim();
	const resolvedPhone = (body.phone || process.env.DEMO_RECIPIENT || '').trim();
	const resolvedEmail = body.email ? String(body.email).trim() : undefined;

	if (!resolvedPhone) {
		return res.status(400).json({ ok: false, error: 'Missing phone (and DEMO_RECIPIENT not set)' });
	}

	const ts = Date.now();
	const nowIso = new Date().toISOString();
	const lead = {
		id: `lead_${ts}`,
		name: resolvedName,
		phone: resolvedPhone,
		email: resolvedEmail,
		source: 'PricingGuide',
		status: 'new',
		createdAt: nowIso,
		...DEFAULT_EVENT,
	};

	const text = `Hey ${resolvedName.split(' ')[0]}, thanks for inquiring! Did you get the pricing guide?\n` +
		`I’d love to invite you for a tour to see the space. Would this Saturday work? I can share a few open times.`;

	const message = {
		id: `msg_${ts}`,
		phone: resolvedPhone,
		direction: 'out',
		text,
		timestamp: nowIso,
	};

	mutate((s) => {
		s.leads.unshift(lead);
		s.messages.push(message);
	});

	return res.status(200).json({ ok: true, lead });
});

// Book a tour slot for a phone/date/time
app.post('/api/book', (req, res) => {
	const body = req.body || {};
	const phone = String(body.phone || '').trim();
	const dateRaw = body.date ? String(body.date) : '';
	const timeRaw = body.time ? String(body.time) : '';

	if (!phone) {
		return res.status(400).json({ ok: false, error: 'Missing phone' });
	}

	const dateParsed = parseDateKeywordOrISO(dateRaw);
	if (!dateParsed) {
		return res.status(400).json({ ok: false, error: 'Invalid date' });
	}

	// Try to parse as 12-hour format first, then 24-hour format
	let timeNorm = parse12hTo24h(timeRaw) || normalizeTimeTo24h(timeRaw);
	if (!timeNorm) {
		return res.status(400).json({ ok: false, error: 'Invalid time' });
	}

	const s = getState();
	const slots = (s.availability && s.availability[dateParsed]) || [];
	// Check if the requested time matches any available slot (compare both 12h input and 24h converted)
	const timeMatch = slots.includes(timeRaw) || slots.includes(timeNorm) || 
		slots.some(slot => parse12hTo24h(slot) === timeNorm);
	// For demo: proceed even if slot isn't listed

	const nowIso = new Date().toISOString();
	const ts = Date.now();

	let lead = s.leads.find((l) => l.phone === phone);
	if (!lead) {
		lead = {
			id: `lead_${ts}`,
			name: 'Guest',
			phone,
			source: 'Manual',
			status: 'new',
			createdAt: nowIso,
			...DEFAULT_EVENT,
		};
	}

	const tour = {
		id: `tour_${ts}`,
		leadId: lead.id,
		leadName: lead.name,
		date: dateParsed,
		time: timeNorm,
		status: 'scheduled',
		createdAt: nowIso,
		...DEFAULT_EVENT,
	};

	const confirmation = {
		id: `msg_${ts}`,
		phone,
		direction: 'out',
		text: `✅ Tour booked for ${dateParsed} at ${formatTimeTo12h(timeNorm)}.\n` +
			`Wedding (75 guests, outside catering).\n` +
			`Reply "book event" to reserve your date.`,
		timestamp: nowIso,
	};

	mutate((st) => {
		// remove slot - find the matching slot in 12h format
		const daySlots = (st.availability && st.availability[dateParsed]) || [];
		const slotToRemove = daySlots.find(slot => 
			slot === timeRaw || parse12hTo24h(slot) === timeNorm
		);
		if (slotToRemove) {
			const idx = daySlots.indexOf(slotToRemove);
			if (idx >= 0) daySlots.splice(idx, 1);
		}
		st.availability[dateParsed] = daySlots;

		// ensure lead exists in state
		const existing = st.leads.find((l) => l.phone === phone);
		if (!existing) {
			st.leads.unshift(lead);
		} else {
			lead = existing;
		}

		// update lead status
		lead.status = 'toured';

		// add tour at front
		st.tours.unshift(tour);

		// log confirmation message
		st.messages.push(confirmation);
	});

	return res.status(200).json({ ok: true, tour });
});

// Confirm an event from an existing tour (convert tour -> booking)
app.post('/api/confirm-event', (req, res) => {
    const body = req.body || {};
    const tourId = String(body.tourId || '').trim();
    const eventDateRaw = body.eventDate ? String(body.eventDate) : '';

    if (!tourId) {
        return res.status(400).json({ ok: false, error: 'Missing tourId' });
    }

    // Accept YYYY-MM-DD only for simplicity
    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDateRaw)) {
        return res.status(400).json({ ok: false, error: 'Invalid eventDate (expected YYYY-MM-DD)' });
    }

    const s = getState();
    const tour = s.tours.find((t) => t.id === tourId);
    if (!tour) {
        return res.status(404).json({ ok: false, error: 'Tour not found' });
    }

    const ts = Date.now();
    const nowIso = new Date().toISOString();

    // Ensure lead exists
    let lead = s.leads.find((l) => l.id === tour.leadId);
    if (!lead) {
        lead = {
            id: tour.leadId || `lead_${ts}`,
            name: tour.leadName || 'Client',
            phone: tour.leadPhone || process.env.DEMO_RECIPIENT || '',
            source: 'Tour',
            status: 'booked',
            createdAt: nowIso,
            ...DEFAULT_EVENT,
        };
    }

    const booking = {
        id: `booking_${ts}`,
        tourId: tour.id,
        leadId: lead.id,
        leadName: lead.name || tour.leadName || 'Client',
        date: eventDateRaw,
        status: 'confirmed',
        createdAt: nowIso,
        ...DEFAULT_EVENT,
    };

    const confirmation = {
        id: `msg_${ts}`,
        phone: lead.phone || '',
        direction: 'out',
        text: `🎉 Wonderful news! Your wedding date on ${eventDateRaw} is now reserved.\n` +
            `I’ve sent the invoice and next steps to your email. Welcome to The Rowan House!`,
        timestamp: nowIso,
    };

    mutate((st) => {
        // Remove the tour from the list (move semantics)
        const idx = st.tours.findIndex((tt) => tt.id === tourId);
        if (idx >= 0) {
            st.tours.splice(idx, 1);
        }

        // Ensure/insert lead
        const existingLead = st.leads.find((l) => l.id === lead.id);
        if (!existingLead) {
            st.leads.unshift(lead);
        } else {
            existingLead.status = 'booked';
        }

        // Add booking
        st.bookings.unshift(booking);

        // Log message
        st.messages.push(confirmation);
    });

    return res.status(200).json({ ok: true, booking });
});

// Create an invoice for a booking
app.post('/api/invoice', (req, res) => {
    const body = req.body || {};
    const bookingId = String(body.bookingId || '').trim();
    const amount = Number(body.amount || 45000);
    if (!bookingId) {
        return res.status(400).json({ ok: false, error: 'Missing bookingId' });
    }
    const s = getState();
    const booking = s.bookings.find((b) => b.id === bookingId);
    if (!booking) {
        return res.status(404).json({ ok: false, error: 'Booking not found' });
    }
    const ts = Date.now();
    const nowIso = new Date().toISOString();
    const invoice = {
        id: `inv_${ts}`,
        bookingId: booking.id,
        leadId: booking.leadId,
        issueDate: nowIso,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        lineItems: [
            { id: `li_${ts}_1`, description: 'Venue Reservation – The Rowan House', qty: 1, unitPrice: amount },
            { id: `li_${ts}_2`, description: 'Security & Cleaning Fee', qty: 1, unitPrice: 750 },
        ],
        currency: 'USD',
        status: 'sent',
        total: amount + 750,
        balanceDue: amount + 750,
    };
    mutate((st) => {
        st.invoices.unshift(invoice);
    });
    return res.status(200).json({ ok: true, invoice });
});

// Fetch invoice by id
app.get('/api/invoice/:id', (req, res) => {
    const id = String(req.params.id || '').trim();
    const s = getState();
    const invoice = (s.invoices || []).find((i) => i.id === id);
    if (!invoice) return res.status(404).json({ ok: false, error: 'Not found' });
    return res.status(200).json({ ok: true, invoice });
});

// Mark invoice as paid (demo)
app.post('/api/invoice/:id/pay', (req, res) => {
    const id = String(req.params.id || '').trim();
    let updated = null;
    mutate((st) => {
        const inv = (st.invoices || []).find((i) => i.id === id);
        if (inv) {
            inv.status = 'paid';
            inv.balanceDue = 0;
            updated = inv;
        }
    });
    if (!updated) return res.status(404).json({ ok: false, error: 'Not found' });
    return res.status(200).json({ ok: true, invoice: updated });
});

// Minimal SMS webhook that replies with TwiML
app.post('/twilio/webhook', (req, res) => {
	const twiml =
		'<?xml version="1.0" encoding="UTF-8"?>' +
		'<Response><Message>Received!</Message></Response>';

	res.set('Content-Type', 'text/xml');
	return res.status(200).send(twiml);
});

app.listen(PORT, () => {
	console.log(`[server] Listening on port ${PORT}`);
});


