// POST { ids: [1,2] } or { id: 1 }
// Marks imported = true for given id(s)
export default async (req: Request) => {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE')!;
  const INCOMING_KEY = Deno.env.get('INCOMING_KEY')!;

  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  if (req.headers.get('authorization') !== `Bearer ${INCOMING_KEY}`) return new Response('Unauthorized', { status: 401 });

  let body;
  try { body = await req.json(); } catch (e) { return new Response('Invalid JSON', { status: 400 }); }
  const ids = body?.ids || (body?.id ? [body.id] : null);
  if (!ids || !Array.isArray(ids) || ids.length === 0) return new Response('ids required', { status: 400 });

  const encoded = ids.map(i => encodeURIComponent(i)).join(',');
  const filter = `id=in.(${encoded})`;

  const resp = await fetch(`${SUPABASE_URL}/rest/v1/table1?${filter}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE,
      'Authorization': `Bearer ${SERVICE_ROLE}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ imported: true })
  });

  const data = await resp.json();
  if (!resp.ok) return new Response(JSON.stringify({ error: data }), { status: resp.status, headers: { 'content-type': 'application/json' } });

  return new Response(JSON.stringify({ ok: true, updated: data }), { status: 200, headers: { 'content-type': 'application/json' } });
};
