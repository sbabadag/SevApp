-- SQL script to fix invalid icon names in categories table
-- Run this in your Supabase SQL Editor

-- Fix bag-outline to briefcase-outline
UPDATE categories 
SET icon = 'briefcase-outline' 
WHERE icon = 'bag-outline';

-- Fix footsteps-outline to walk-outline (if exists)
UPDATE categories 
SET icon = 'walk-outline' 
WHERE icon = 'footsteps-outline';

-- Verify the changes
SELECT id, name, icon FROM categories;


