import { apiClient } from '../lib/api-client';
import { Property } from '../types/api';

// Seller statistics interface
export interface SellerStats {
  totalOffers: number;
  pendingOffers: number;
  acceptedOffers: number;
  averageOfferValue: number;
  totalProperties: number;
  totalViews: number;
  averagePropertyValue: number;
}

// Analytics interfaces
export interface AnalyticsData {
  totalViews: number;
  totalInquiries: number;
  totalOffers: number;
  averageViewsPerListing: number;
  conversionRate: number;
  topPerformingListing: {
    id: string;
    title: string;
    views: number;
  } | null;
  chartData: ChartData[];
}

export interface ChartData {
  month: string;
  views: number;
  inquiries: number;
  offers: number;
}

// Seller API functions
export const sellerApi = {
  // Fix route to match backend implementation
  async getSellerOverview(sellerId: string): Promise<SellerStats> {
    try {
      // Change from /seller/ to /sellers/ to match backend route
      const response = await apiClient.get(`/sellers/${sellerId}/overview`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching seller overview:', error);
      throw new Error('Failed to fetch seller overview');
    }
  },

  // New analytics endpoint
  async getSellerAnalytics(sellerId: string, timeRange: string = '6months'): Promise<AnalyticsData> {
    try {
      const response = await apiClient.get(`/sellers/${sellerId}/analytics?timeRange=${timeRange}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching seller analytics:', error);
      throw new Error('Failed to fetch seller analytics');
    }
  },

  async getSellerListings(sellerId: string, params?: { page?: number; limit?: number; status?: string }): Promise<{ data: Property[]; meta: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      
      const response = await apiClient.get(`/sellers/${sellerId}/listings?${queryParams}`);
      return {
        data: response.data.data,
        meta: response.data.meta
      };
    } catch (error) {
      console.error('Error fetching seller listings:', error);
      throw new Error('Failed to fetch seller listings');
    }
  }
};

export default sellerApi;