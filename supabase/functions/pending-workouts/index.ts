// GET?device_id=<id>
// Returns rows where device_id=... and imported=false
export default async (req: Request) => {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE')!;
  const url = new URL(req.url);
  const device_id = url.searchParams.get('device_id');
  if (!device_id) return new Response('device_id required', { status: 400 });

  const qs = `device_id=eq.${encodeURIComponent(device_id)}&imported=eq.false&select=*`;
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/table1?${qs}`, {
    method: 'GET',
    headers: {
      'apikey': SERVICE_ROLE,
      'Authorization': `Bearer ${SERVICE_ROLE}`,
      'Accept': 'application/json'
    }
  });

  const data = await resp.json();
  if (!resp.ok) return new Response(JSON.stringify({ error: data }), { status: resp.status, headers: { 'content-type': 'application/json' } });
  return new Response(JSON.stringify({ ok: true, rows: data }), { status: 200, headers: { 'content-type': 'application/json' } });
};
