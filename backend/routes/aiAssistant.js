import express from 'express';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../supabaseClient.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();
router.use(requireAdmin);

const upload = multer({ storage: multer.memoryStorage() });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const EXTRACTION_PROMPT = `You are an assistant helping a B2B sourcing company (Tang Line Trading) turn
supplier documents, product photos, or text instructions into a catalog entry.

Read the provided content (document/image/text) plus any admin instructions, and return ONLY a JSON
object with this exact shape, no markdown, no extra text:

{
  "name": "string - concise product name",
  "description": "string - 1-3 sentence description suitable for a public catalog",
  "category": "string - one of: Construction Machinery, Industrial Printers, Electronics, General Goods (pick closest match, or General Goods if unclear)",
  "country_of_origin": "string - default to China if not specified",
  "price_range": "string - use 'Quote on request' unless a clear price is given",
  "ai_summary": "string - one sentence explaining what you extracted and from what source, for the admin to review"
}

If information is missing or unclear, make a reasonable assumption and note it in ai_summary.`;

// POST /api/admin/ai-assistant/draft
// Accepts: multipart form with optional 'file' (pdf or image) and 'instructions' (text)
router.post('/draft', upload.single('file'), async (req, res) => {
  try {
    const { instructions } = req.body;
    const file = req.file;

    if (!file && !instructions) {
      return res.status(400).json({ error: 'Provide a file and/or instructions' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const parts = [{ text: EXTRACTION_PROMPT }];
    if (instructions) {
      parts.push({ text: `Admin instructions: ${instructions}` });
    }

    let sourceType = 'text';
    if (file) {
      sourceType = file.mimetype === 'application/pdf' ? 'pdf' : 'photo';
      parts.push({
        inlineData: {
          mimeType: file.mimetype,
          data: file.buffer.toString('base64'),
        },
      });
    }

    const result = await model.generateContent(parts);
    const rawText = result.response.text().trim();

    // Strip accidental markdown fences if the model adds them
    const cleaned = rawText.replace(/^```json\s*|```\s*$/g, '');
    let extracted;
    try {
      extracted = JSON.parse(cleaned);
    } catch (e) {
      return res.status(500).json({ error: 'AI returned unparseable output', raw: rawText });
    }

    // Save as a draft for admin review (NOT published yet)
    const { data, error } = await supabase
      .from('product_drafts')
      .insert([{
        source_type: sourceType,
        extracted_data: extracted,
        ai_summary: extracted.ai_summary || '',
        status: 'draft',
      }])
      .select();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI processing failed', details: err.message });
  }
});

// GET /api/admin/ai-assistant/drafts - list all drafts pending review
router.get('/drafts', async (req, res) => {
  const { data, error } = await supabase
    .from('product_drafts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PUT /api/admin/ai-assistant/drafts/:id - revise a draft's extracted_data (before approving)
router.put('/drafts/:id', async (req, res) => {
  const { id } = req.params;
  const { extracted_data } = req.body;
  const { data, error } = await supabase
    .from('product_drafts')
    .update({ extracted_data })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// POST /api/admin/ai-assistant/drafts/:id/approve - publish draft as a live product
router.post('/drafts/:id/approve', async (req, res) => {
  const { id } = req.params;
  const { image_url } = req.body; // admin can attach/confirm final image URL at approval time

  const { data: draft, error: draftErr } = await supabase
    .from('product_drafts')
    .select('*')
    .eq('id', id)
    .single();
  if (draftErr) return res.status(500).json({ error: draftErr.message });

  const d = draft.extracted_data;
  const { data: product, error: prodErr } = await supabase
    .from('products')
    .insert([{
      name: d.name,
      description: d.description,
      category: d.category,
      country_of_origin: d.country_of_origin,
      price_range: d.price_range,
      image_url: image_url || null,
      status: 'active',
    }])
    .select();
  if (prodErr) return res.status(500).json({ error: prodErr.message });

  await supabase
    .from('product_drafts')
    .update({ status: 'approved', linked_product_id: product[0].id })
    .eq('id', id);

  res.json(product[0]);
});

// POST /api/admin/ai-assistant/drafts/:id/reject
router.post('/drafts/:id/reject', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('product_drafts').update({ status: 'rejected' }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

export default router;
