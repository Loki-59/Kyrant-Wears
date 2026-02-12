import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { supabaseAdmin } from '../config/supabase.js';
import { z } from 'zod';

const router = express.Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['buyer', 'designer', 'admin']),
  full_name: z.string().min(1).optional(),
});

// Signup (create account)
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role, full_name } = signupSchema.parse(req.body);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for simplicity; adjust as needed
    });

    if (authError) throw authError;

    // Create profile
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        role,
        full_name: full_name || email.split('@')[0], // Default to username part of email
      })
      .select()
      .single();

    if (profileError) throw profileError;

    res.status(201).json({ message: 'Account created successfully', user: { id: authData.user.id, email, role } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Admin create user (for admins to create accounts)
router.post('/create-user', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { email, password, role, full_name } = signupSchema.parse(req.body);

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) throw authError;

    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        role,
        full_name: full_name || email.split('@')[0],
      })
      .select()
      .single();

    if (profileError) throw profileError;

    res.status(201).json({ message: 'User created successfully', user: { id: authData.user.id, email, role } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get current user profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as authRoutes };
