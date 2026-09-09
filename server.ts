import express from 'express';
import cors from 'cors';

const app = express();
const port = Number(process.env.PORT) || 10000;
const bccBaseUrl = (process.env.BCC_ESCROW_BASE_URL || '').replace(/\/$/, '');
const bccTokenUrl = process.env.BCC_OAUTH_TOKEN_URL || '';
const bccClientId = process.env.BCC_CLIENT_ID || '';
const bccClientSecret = process.env.BCC_CLIENT_SECRET || '';
const bccScope = process.env.BCC_SCOPE || 'bcc.application.escrow.api';

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || false }));
app.use(express.json({ limit: '32kb' }));

function requireConfig() {
  if (!bccBaseUrl || !bccTokenUrl || !bccClientId || !bccClientSecret) {
    throw new Error('BCC OAuth environment variables are not configured.');
  }
}

async function getBccToken(): Promise<string> {
  requireConfig();
  const response = await fetch(bccTokenUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${bccClientId}:${bccClientSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: bccScope
    })
  });
  if (!response.ok) {
    throw new Error(`BCC OAuth rejected the request (${response.status}).`);
  }
  const data = await response.json() as { access_token?: string };
  if (!data.access_token) {
    throw new Error('BCC OAuth response did not contain access_token.');
  }
  return data.access_token;
}

async function bccRequest(path: string, method: 'GET' | 'POST' | 'PUT', body?: unknown) {
  const token = await getBccToken();
  const response = await fetch(`${bccBaseUrl}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`BCC Escrow rejected the request (${response.status}).`);
  }
  return data;
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'magicplay-escrow-backend' });
});

app.post('/api/escrow/holds', async (req, res) => {
  try {
    const payload = req.body?.bccDeal;
    if (!payload || typeof payload !== 'object') {
      res.status(400).json({ error: 'bccDeal payload is required.' });
      return;
    }
    const result = await bccRequest('/ext/deals', 'POST', payload);
    const dealId = result?.resultObject?.dealId;
    if (!dealId) {
      res.status(502).json({ error: 'BCC did not return a dealId.' });
      return;
    }
    res.status(201).json({ escrowTxId: dealId, status: 'escrow_held', provider: 'bcc' });
  } catch (error) {
    console.error('BCC hold failed:', error);
    res.status(502).json({ error: 'Escrow provider request failed.' });
  }
});

app.get('/api/escrow/deals/:id', async (req, res) => {
  try {
    res.json(await bccRequest(`/ext/deals/${encodeURIComponent(req.params.id)}`, 'GET'));
  } catch (error) {
    console.error('BCC status failed:', error);
    res.status(502).json({ error: 'Escrow provider request failed.' });
  }
});

app.put('/api/escrow/deals/:id', async (req, res) => {
  try {
    res.json(await bccRequest(`/ext/deals/${encodeURIComponent(req.params.id)}`, 'PUT'));
  } catch (error) {
    console.error('BCC status update failed:', error);
    res.status(502).json({ error: 'Escrow provider request failed.' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`MagicPlay escrow backend listening on ${port}`);
});
