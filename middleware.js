// Vercel Edge Middleware: password-gate the /hq control room with HTTP Basic Auth.
// Credentials come from Vercel env vars HQ_USER and HQ_PASS (Production).
// Set them in Vercel: Project, Settings, Environment Variables. Never commit them.

export const config = {
  matcher: ['/hq', '/hq/:path*'],
};

export default function middleware(request) {
  const USER = process.env.HQ_USER;
  const PASS = process.env.HQ_PASS;

  const denied = () =>
    new Response('Authentication required.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="RRS Control Room", charset="UTF-8"',
        'Cache-Control': 'no-store',
      },
    });

  // If no credentials are configured yet, keep the page locked.
  if (!USER || !PASS) return denied();

  const header = request.headers.get('authorization') || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    let decoded = '';
    try { decoded = atob(encoded); } catch (e) {}
    const idx = decoded.indexOf(':');
    if (idx !== -1) {
      const u = decoded.slice(0, idx);
      const p = decoded.slice(idx + 1);
      if (u === USER && p === PASS) return; // authorized, continue to the page
    }
  }
  return denied();
}
