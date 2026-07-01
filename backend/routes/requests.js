import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// POST /api/requests - client submits a product request
router.post('/', async (req, res) => {
  const {
    name, company, email, phone, destination_country,
    product_description, quantity, budget_range, image_url, notes
  } = req.body;

  if (!name || !email || !destination_country || !product_description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase
    .from('requests')
    .insert([{ name, company, email, phone, destination_country, product_description, quantity, budget_range, image_url, notes }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  // TODO optional: trigger email notification here (Resend/SendGrid) using process.env.NOTIFY_EMAIL

  res.status(201).json(data[0]);
});

export default router;
