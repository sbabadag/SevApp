-- Campaigns/Banners Table for Admin Panel
-- Run this SQL in your Supabase SQL Editor

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  image_url TEXT NOT NULL,
  link_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_campaigns_active ON campaigns(is_active);
CREATE INDEX IF NOT EXISTS idx_campaigns_display_order ON campaigns(display_order);

-- Enable Row Level Security (RLS)
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to active campaigns
CREATE POLICY "Public can view active campaigns" ON campaigns
  FOR SELECT
  USING (is_active = true);

-- Policy: Allow authenticated users to manage campaigns (admin only)
CREATE POLICY "Authenticated users can manage campaigns" ON campaigns
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert sample campaigns
INSERT INTO campaigns (title, subtitle, image_url, display_order, is_active) VALUES
  ('Summer Sale', 'Up to 50% OFF', 'https://via.placeholder.com/400x200?text=Summer+Sale', 1, true),
  ('New Collection', 'Latest Fashion Trends', 'https://via.placeholder.com/400x200?text=New+Collection', 2, true)
ON CONFLICT DO NOTHING;

