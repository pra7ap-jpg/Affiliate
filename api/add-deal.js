// DISABLED on 2026-11-01 for security.
// This endpoint used to accept unauthenticated POSTs from anyone and write
// to the product Sheet, with API keys hard-coded in the source. All admin
// writes now go through /api/admin-add, which requires the admin password
// and keeps every secret in server-side environment variables.
export default function handler(req, res) {
    res.status(410).json({ error: 'This endpoint has been retired. Use the admin panel.' });
}
