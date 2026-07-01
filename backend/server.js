import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import productsRouter from './routes/products.js';
import requestsRouter from './routes/requests.js';
import contactRouter from './routes/contact.js';
import adminRouter from './routes/admin.js';
import aiAssistantRouter from './routes/aiAssistant.js';
import categoriesRouter, { adminCategoriesRouter } from './routes/categories.js';
import uploadRouter from './routes/upload.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/products', productsRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/categories', categoriesRouter);

// Admin routes (protected by x-admin-password header)
app.use('/api/admin', adminRouter);
app.use('/api/admin/ai-assistant', aiAssistantRouter);
app.use('/api/admin/categories', adminCategoriesRouter);
app.use('/api/admin/upload', uploadRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Tang Line backend running on port ${PORT}`));
