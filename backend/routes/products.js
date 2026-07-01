import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// GET /api/products - public catalog (only active products)
router.get('/', async (req, res) => {
  const { category, search } = req.query;
  let query = supabase.from('products').select('*').eq('status', 'active').order('created_at', { ascending: false });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
