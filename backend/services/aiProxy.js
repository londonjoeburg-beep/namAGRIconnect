import fetch from 'node-fetch';

const AI = process.env.AI_SERVICE_URL || 'http://localhost:5000';

export async function callSoilAI(payload) {
  const r = await fetch(`${AI}/analyze/soil`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error('AI soil service error');
  return r.json();
}

export async function callVirusAI(payload) {
  const r = await fetch(`${AI}/analyze/virus`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error('AI virus service error');
  return r.json();
}

export async function callWaterAI(payload) {
  const r = await fetch(`${AI}/analyze/water`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error('AI water service error');
  return r.json();
}