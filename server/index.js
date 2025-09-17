import express from 'express';

const app = express();
const PORT = process.env.PORT || 4000;

// Twilio sends application/x-www-form-urlencoded by default
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
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


