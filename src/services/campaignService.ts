import { supabase } from '../config/supabase';

export interface Campaign {
  id: number;
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  display_order: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

class CampaignService {
  /**
   * Get active campaigns from Supabase
   */
  async getCampaigns(): Promise<{ data: Campaign[] | null; error: any }> {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('is_active', true)
        .or(`start_date.is.null,start_date.lte.${now}`)
        .or(`end_date.is.null,end_date.gte.${now}`)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('CampaignService: Error fetching campaigns:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('CampaignService: Exception fetching campaigns:', error);
      return { data: null, error };
    }
  }

  /**
   * Subscribe to real-time campaign changes
   */
  subscribeToCampaigns(
    callback: (campaign: Campaign) => void
  ): Promise<() => void> {
    return new Promise((resolve, reject) => {
      const channel = supabase
        .channel('campaigns-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'campaigns',
          },
          (payload) => {
            console.log('CampaignService: Real-time update received:', payload.eventType);
            if (payload.new) {
              callback(payload.new as Campaign);
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('CampaignService: ✅ Real-time subscription active');
            resolve(() => {
              supabase.removeChannel(channel);
            });
          } else if (status === 'CHANNEL_ERROR') {
            console.warn('CampaignService: ⚠️ Real-time subscription error. Polling will be used as fallback.');
            console.warn('CampaignService: To enable real-time, go to Supabase Dashboard → Database → Replication');
            console.warn('CampaignService: Enable replication for the "campaigns" table');
            // Return a no-op cleanup function
            resolve(() => {});
          } else if (status === 'TIMED_OUT') {
            console.warn('CampaignService: ⚠️ Real-time subscription timed out.');
            resolve(() => {});
          }
        });
    });
  }
}

export const campaignService = new CampaignService();

