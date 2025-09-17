export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const twiml = '<?xml version="1.0" encoding="UTF-8"?><Response><Message>Received!</Message></Response>';
  res.setHeader('Content-Type', 'text/xml');
  return res.status(200).send(twiml);
}


