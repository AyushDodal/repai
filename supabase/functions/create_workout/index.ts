// POST: accepts { device_id, parsed, raw_text? }
// Headers: Authorization: Bearer <INCOMING_KEY>
export default async (req: Request) => {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE')!;
  const INCOMING_KEY = Deno.env.get('INCOMING_KEY')!;

  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  if (req.headers.get('authorization') !== `Bearer ${INCOMING_KEY}`) return new Response('Unauthorized', { status: 401 });

  let body;
  try { body = await req.json(); } catch (e) { return new Response('Invalid JSON', { status: 400 }); }
  const { device_id, parsed, raw_text } = body || {};

  if (!device_id || !parsed) {
    return new Response(JSON.stringify({ error: 'device_id and parsed required' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }

  // choose first exercise for compatibility fields
  const firstEx = Array.isArray(parsed.exercises) && parsed.exercises.length > 0 ? parsed.exercises[0] : null;

  const insert = {
    device_id,
    date: parsed.date || new Date().toISOString().slice(0,10),
    exercise: parsed.type || parsed.title || (firstEx ? firstEx.name : null),
    weight: firstEx && typeof firstEx.weight !== 'undefined' ? firstEx.weight : null,
    sets: firstEx && typeof firstEx.sets !== 'undefined' ? firstEx.sets : null,
    reps: firstEx && typeof firstEx.reps !== 'undefined' ? firstEx.reps : null,
    parsed: parsed,
    raw_text: raw_text || null,
    imported: false,
    created_at: new Date().toISOString()
  };

  const resp = await fetch(`${SUPABASE_URL}/rest/v1/table1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE,
      'Authorization': `Bearer ${SERVICE_ROLE}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(insert)
  });

  const data = await resp.json();
  if (!resp.ok) return new Response(JSON.stringify({ error: data }), { status: resp.status, headers: { 'content-type': 'application/json' } });

  return new Response(JSON.stringify({ ok: true, row: data[0] }), { status: 200, headers: { 'content-type': 'application/json' } });
};
