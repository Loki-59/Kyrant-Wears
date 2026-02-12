import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { supabaseAdmin } from '../config/supabase.js';
import { z } from 'zod';

const router = express.Router();

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  category_id: z.string().uuid(),
  images: z.array(z.string()).optional(),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
});

// Get all active products (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, categories(name)')
      .eq('status', 'active');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get products by designer (authenticated)
router.get('/my', authenticate, requireRole(['designer']), async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, categories(name)')
      .eq('designer_id', req.user.id);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product (designers only)
router.post('/', authenticate, requireRole(['designer']), async (req, res) => {
  try {
    const validatedData = productSchema.parse(req.body);
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({ ...validatedData, designer_id: req.user.id })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update product (owner only)
router.put('/:id', authenticate, requireRole(['designer']), async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = productSchema.partial().parse(req.body);

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(validatedData)
      .eq('id', id)
      .eq('designer_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Delete product (owner or admin)
router.delete('/:id', authenticate, requireRole(['designer', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)
      .eq('designer_id', req.user.id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as productRoutes };
