import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { supabaseAdmin } from '../config/supabase.js';
import { z } from 'zod';

const router = express.Router();

const profileUpdateSchema = z.object({
  full_name: z.string().min(1).optional(),
  bio: z.string().optional(),
  avatar_url: z.string().url().optional(),
});

// Get profile by ID (public for designers)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update own profile
router.put('/', authenticate, async (req, res) => {
  try {
    const validatedData = profileUpdateSchema.parse(req.body);
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(validatedData)
      .eq('id', req.user.id)
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

// Get all designers (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('role', 'designer');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as profileRoutes };
