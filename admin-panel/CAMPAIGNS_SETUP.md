# Campaigns Management Setup

## Overview

Campaigns management has been added to the admin panel. You can now manage promotional banners and campaigns (Summer Sale, New Collection, etc.) from the admin interface.

## Setup Steps

### 1. Create Database Table

Run the SQL script in your Supabase SQL Editor:

```bash
admin-panel/supabase-campaigns-setup.sql
```

This will:
- Create the `campaigns` table
- Set up indexes for performance
- Enable Row Level Security (RLS)
- Create policies for public read and authenticated write
- Insert sample campaigns (Summer Sale, New Collection)

### 2. Access Campaigns Page

1. Log in to the admin panel
2. Go to Dashboard
3. Click on "Campaigns" card
4. Or navigate directly to: `http://localhost:5173/campaigns`

## Features

### Campaign Management

- ✅ **Create Campaigns**: Add new promotional banners
- ✅ **Edit Campaigns**: Update existing campaigns
- ✅ **Delete Campaigns**: Remove campaigns
- ✅ **Image Upload**: Upload campaign images to Supabase Storage
- ✅ **Display Order**: Control the order of campaigns
- ✅ **Active/Inactive**: Toggle campaign visibility
- ✅ **Date Range**: Set start and end dates for campaigns
- ✅ **Link URLs**: Add clickable links to campaigns

### Campaign Fields

- **Title** (required): Campaign name (e.g., "Summer Sale")
- **Subtitle** (optional): Additional text (e.g., "Up to 50% OFF")
- **Image URL** (required): Campaign banner image
- **Link URL** (optional): Where the banner should link to
- **Display Order**: Order in which campaigns appear (lower numbers first)
- **Active**: Whether the campaign is visible
- **Start Date** (optional): When the campaign starts
- **End Date** (optional): When the campaign ends

## Usage

### Creating a Campaign

1. Click "Add Campaign" button
2. Fill in the form:
   - Enter title (e.g., "Summer Sale")
   - Enter subtitle (e.g., "Up to 50% OFF")
   - Upload or enter image URL
   - Set display order (1 = first, 2 = second, etc.)
   - Toggle "Active" to show/hide
   - Optionally set start/end dates
3. Click "Create Campaign"

### Editing a Campaign

1. Find the campaign in the list
2. Click "Edit" button
3. Update the fields
4. Click "Update Campaign"

### Deleting a Campaign

1. Find the campaign in the list
2. Click "Delete" button
3. Confirm deletion

## Mobile App Integration

The mobile app (`HomeScreen.tsx`) currently uses hardcoded banners. To use campaigns from the database:

1. Create a `campaignService.ts` in `src/services/`
2. Fetch campaigns from Supabase
3. Update `HomeScreen.tsx` to use the service

Example service:

```typescript
// src/services/campaignService.ts
import { supabase } from '../config/supabase';

export const campaignService = {
  async getCampaigns() {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    return { data, error };
  }
};
```

## Database Schema

```sql
campaigns (
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
)
```

## Security

- **Public Read**: Anyone can view active campaigns (for mobile app)
- **Authenticated Write**: Only logged-in admin users can create/edit/delete campaigns
- **RLS Enabled**: Row Level Security is enabled for the campaigns table

## Next Steps

1. ✅ Run the SQL script to create the table
2. ✅ Access the campaigns page in admin panel
3. ✅ Create your first campaign
4. ⏳ Update mobile app to fetch campaigns from database (optional)

