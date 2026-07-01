import express from 'express';
import { supabase } from '../supabaseClient.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// GET /api/categories - public, used to populate filters/dropdowns
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Admin-only management, mounted separately at /api/admin/categories
export const adminCategoriesRouter = express.Router();
adminCategoriesRouter.use(requireAdmin);

adminCategoriesRouter.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const { data, error } = await supabase.from('categories').insert([{ name }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

adminCategoriesRouter.put('/:id', async (req, res) => {
  const { name } = req.body;
  const { data, error } = await supabase.from('categories').update({ name }).eq('id', req.params.id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

adminCategoriesRouter.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('categories').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

export default router;
