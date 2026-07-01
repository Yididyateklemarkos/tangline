// Simple shared-password admin auth.
// Frontend sends header: x-admin-password
// Good enough for a one-person admin team; upgrade to Supabase Auth later if you add staff.

export function requireAdmin(req, res, next) {
  const provided = req.headers['x-admin-password'];
  if (!provided || provided !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
