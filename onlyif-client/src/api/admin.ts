// ... existing code ...
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
        isNetworkError: error.isNetworkError
      });
      throw error;
    }
  },
  getProperties: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
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
      console.error('❌ Admin