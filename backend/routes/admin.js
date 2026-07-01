import express from 'express';
import { supabase } from '../supabaseClient.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();
router.use(requireAdmin);

// --- PRODUCTS (admin sees all, including inactive) ---
router.get('/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/products', async (req, res) => {
  const { name, description, category, country_of_origin, image_url, price_range, status } = req.body;
  const { data, error } = await supabase
    .from('products')
    .insert([{ name, description, category, country_of_origin, image_url, price_range, status: status || 'active' }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('products').update(req.body).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

// --- REQUESTS ---
router.get('/requests', async (req, res) => {
  const { data, error } = await supabase.from('requests').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.put('/requests/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { data, error } = await supabase.from('requests').update({ status }).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// --- CONTACT MESSAGES ---
router.get('/contact-messages', async (req, res) => {
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.put('/contact-messages/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { data, error } = await supabase.from('contact_messages').update({ status }).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

export default router;
