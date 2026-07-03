// Same-origin relay for the ransomware.live public API.
// Serves /rl-api/<endpoint> by fetching https://api.ransomware.live/v2/<endpoint>
// server-side, so the browser never makes a cross-origin request.
export async function onRequest(context) {
  const { params, request } = context;
  const parts = Array.isArray(params.path) ? params.path : [params.path];
  const path = parts.join('/');
  if (!/^[a-zA-Z0-9/_-]+$/.test(path)) {
    return new Response('{"error":"bad path"}', { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  const search = new URL(request.url).search;
  const target = 'https://api.ransomware.live/v2/' + path + search;
  try {
    const res = await fetch(target, { headers: { 'User-Agent': 'RENO-Observatory-Relay' } });
    return new Response(res.body, {
      status: res.status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=120'
      }
    });
  } catch (e) {
    return new Response('{"error":"upstream unreachable"}', { status: 502, headers: { 'Content-Type': 'application/json' } });
  }
}
