import express from 'express';
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

function seedState() {
 	const times = ['10:00','11:30','13:00','15:00','16:30'];
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

 	return {
 		leads: [
 			{
 				id: 'lead_1',
 				name: 'Sajid Memon',
 				phone: '+12142773806',
 				...DEFAULT_EVENT,
 				createdAt: new Date().toISOString(),
 			},
 			{
 				id: 'lead_2',
 				name: 'Haroon Memon',
 				phone: '+19729002244',
 				...DEFAULT_EVENT,
 				createdAt: new Date().toISOString(),
 			},
 		],
 		tours: [],
 		bookings: [],
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
	const { leads, tours, bookings, messages, availability } = getState();
	return res.status(200).json({ leads, tours, bookings, messages, availability });
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

	const text = `Hi ${resolvedName}! This is Everbook ✨\n` +
		`I’ve saved your Wedding for 75 guests with outside catering.\n` +
		`Here’s our pricing guide: https://example.com/pricing\n` +
		`Reply "tour YYYY-MM-DD" (or "today"/"tomorrow") to see times.`;

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


