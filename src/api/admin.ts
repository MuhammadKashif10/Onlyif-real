import { apiClient } from '../lib/api-client';

export const adminApi = {
  // Dashboard
  getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),
  getAnalytics: (period: string) => apiClient.get(`/admin/analytics?period=${period}`),

  // Users
  getUsers: (params?: { page?: number; limit?: number; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';
    return apiClient.get(endpoint);
  },

  getUserStats: () => apiClient.get('/admin/users/stats'),

  suspendUser: (userId: string) => apiClient.patch(`/admin/users/${userId}/suspend`),
  unsuspendUser: (userId: string) => apiClient.patch(`/admin/users/${userId}/unsuspend`),
  
  // New methods for user status management
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => 
    apiClient.patch(`/admin/users/${userId}/status`, { status }),
  
  deleteUser: (userId: string) => 
    apiClient.delete(`/admin/users/${userId}`),

  // Properties - Updated to use /admin/properties for admin-specific functionality
  // Properties - Use the correct /properties endpoint that actually works
  getProperties: async (params?: { page?: number; limit?: 1000; status?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/properties?${queryString}` : '/properties';
    
    console.log('🔄 Admin API: Fetching properties from endpoint:', endpoint);
    console.log('🔄 Admin API: Query params:', params);
    console.log('🔄 Admin API: Full URL will be:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}${endpoint}`);
    
    try {
      // Add a test to check if backend is reachable
      const testResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/health`);
      if (!testResponse.ok) {
        throw new Error('Backend server is not responding. Please check if the backend is running on port 5000.');
      }
      
      const response = await apiClient.get(endpoint);
      console.log('✅ Admin API: Properties response:', response);
      console.log('📦 Admin API: Response data structure:', {
        hasData: !!response.data,
        hasProperties: !!response.properties,
        dataType: typeof response.data,
        propertiesType: typeof response.properties,
        responseKeys: Object.keys(response)
      });
      return response;
    } catch (error) {
      console.error('❌ Admin API: Error fetching properties:', error);
      console.error('❌ Admin API: Error details:', {
        message: error.message,
        endpoint: endpoint,
        isNetworkError: error.isNetworkError,
        status: error.status
      });
      
      // Provide more specific error messages
      if (error.message.includes('Backend server is not responding')) {
        throw new Error('Backend server is not running. Please start the backend server on port 5000.');
      } else if (error.isNetworkError) {
        throw new Error('Cannot connect to backend server. Please check if the backend is running and accessible.');
      } else if (error.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      throw error;
    }
  },
  
  // Keep other property methods using admin routes for admin-specific actions
  approveProperty: (propertyId: string) => apiClient.patch(`/properties/${propertyId}/approve`),
  rejectProperty: (propertyId: string) => apiClient.patch(`/properties/${propertyId}/reject`),
  updateProperty: (propertyId: string, data: any) => apiClient.patch(`/admin/properties/${propertyId}`, data),
  assignPropertyToAgent: (propertyId: string, data: { agentId: string }) => apiClient.patch(`/admin/properties/${propertyId}/assign-agent`, data),
  deleteProperty: (propertyId: string) => apiClient.delete(`/admin/properties/${propertyId}`),

  // Agents
  getAgents: (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/agents?${queryString}` : '/admin/agents';
    return apiClient.get(endpoint);
  },

  updateAgentStatus: (agentId: string, status: string) => 
    apiClient.patch(`/admin/agents/${agentId}/status`, { status }),

  deleteAgent: (agentId: string) => 
    apiClient.delete(`/admin/agents/${agentId}`),

  assignAgent: (propertyId: string, agentId: string) => 
    apiClient.patch(`/admin/properties/${propertyId}/assign-agent`, { agentId }),

  // Payments
  getPayments: (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/payments?${queryString}` : '/admin/payments';
    return apiClient.get(endpoint);
  },

  getMonthlyRevenue: () => apiClient.get('/admin/payments/monthly-revenue'),

  // Settings
  getSettings: () => apiClient.get('/admin/settings'),
  updateSettings: (settings: any) => apiClient.put('/admin/settings', settings),

  // Auth
  changePassword: (data: { currentPassword: string; newPassword: string }) => 
    apiClient.post('/admin/change-password', data),

  // Stats
  getPropertiesCount: () => apiClient.get('/admin/stats/properties'),
  getAgentsCount: () => apiClient.get('/admin/stats/agents'),
  getUsersCount: () => apiClient.get('/admin/stats/users'),

  // Activity
  getRecentActivity: () => apiClient.get('/admin/activity'),

  // Agents
  createAgent: (data: { name: string; email: string; password: string; experience?: string; location?: string }) => 
    apiClient.post('/agents', { ...data, role: 'agent' }),
  
  updateAgentStatus: (agentId: string, status: string) => 
    apiClient.patch(`/admin/agents/${agentId}/status`, { status }),
  
  deleteAgent: (agentId: string) => 
    apiClient.delete(`/admin/agents/${agentId}`),

  assignAgent: (propertyId: string, agentId: string) => 
    apiClient.patch(`/admin/properties/${propertyId}/assign-agent`, { agentId }),

  // Payments
  getPayments: (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/payments?${queryString}` : '/admin/payments';
    return apiClient.get(endpoint);
  },

  getMonthlyRevenue: () => apiClient.get('/admin/payments/monthly-revenue'),

  // Settings
  getSettings: () => apiClient.get('/admin/settings'),
  updateSettings: (settings: any) => apiClient.put('/admin/settings', settings),

  // Auth
  changePassword: (data: { currentPassword: string; newPassword: string }) => 
    apiClient.post('/admin/change-password', data),

  // Stats
  getPropertiesCount: () => apiClient.get('/admin/stats/properties'),
  getAgentsCount: () => apiClient.get('/admin/stats/agents'),
  getUsersCount: () => apiClient.get('/admin/stats/users'),

  // Activity
  getRecentActivity: () => apiClient.get('/admin/activity'),
};