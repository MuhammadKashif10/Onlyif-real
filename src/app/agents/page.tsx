'use client';

import { useEffect, useState } from 'react';
import { Navbar, AgentCardSkeleton, LoadingError } from '@/components';
import { agentsApi } from '@/api';
import HeroSection from '@/components/sections/HeroSection';

// Mock data as fallback when API fails
const mockAgents = [
  {
    id: 'mock-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    avatar: null, // Changed from '/images/default-avatar.jpg'
    title: 'Senior Real Estate Agent',
    office: 'Premium Realty',
    rating: '4.8',
    reviews: 127,
    experience: '8 years',
    specializations: ['Residential', 'Commercial'],
    languages: ['English', 'Spanish']
  },
  {
    id: 'mock-2',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '(555) 987-6543',
    avatar: null, // Changed from '/images/default-avatar.jpg'
    title: 'Luxury Property Specialist',
    office: 'Elite Properties',
    rating: '4.9',
    reviews: 89,
    experience: '6 years',
    specializations: ['Luxury Homes', 'Investment'],
    languages: ['English']
  },
  {
    id: 'mock-3',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    phone: '(555) 456-7890',
    avatar: null, // Changed from '/images/default-avatar.jpg'
    title: 'First-Time Buyer Specialist',
    office: 'Community Realty',
    rating: '4.7',
    reviews: 156,
    experience: '5 years',
    specializations: ['First-Time Buyers', 'Condos'],
    languages: ['English', 'French']
  }
];

const mockStats = {
  totalAgents: 150,
  totalPropertiesSold: 2847,
  averageRating: 4.8
};

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [topAgents, setTopAgents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setUsingMockData(false);
        
        console.log('🚀 Starting API calls...');
        
        // Try to fetch real data with timeout
        const fetchWithTimeout = (promise, timeout = 10000) => {
          return Promise.race([
            promise,
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
          ]);
        };
        
        const [agentsData, topAgentsData, statsData] = await Promise.allSettled([
          fetchWithTimeout(agentsApi.getAgents()),
          fetchWithTimeout(agentsApi.getTopAgents(3)),
          fetchWithTimeout(agentsApi.getGeneralStats())
        ]);
        
        console.log('📊 API Results:', { agentsData, topAgentsData, statsData });
        
        // Check if any API calls failed
        const hasApiErrors = [
          agentsData.status === 'rejected',
          topAgentsData.status === 'rejected', 
          statsData.status === 'rejected'
        ].some(failed => failed);
        
        if (hasApiErrors) {
          console.warn('⚠️ Some API calls failed, using mock data as fallback');
          throw new Error('API calls failed, using fallback data');
        }
        
        // Process successful API responses
        const processedAgents = processAgentsData(
          agentsData.status === 'fulfilled' ? agentsData.value : null
        );
        const processedTopAgents = processAgentsData(
          topAgentsData.status === 'fulfilled' ? topAgentsData.value : null
        );
        const processedStats = processStatsData(
          statsData.status === 'fulfilled' ? statsData.value : null
        );
        
        setAgents(processedAgents);
        setTopAgents(processedTopAgents.slice(0, 3)); // Ensure only 3 top agents
        setStats(processedStats);
        
        console.log('✅ Successfully loaded real data');
        
      } catch (error) {
        console.error('❌ Error fetching data, falling back to mock data:', error);
        
        // Use mock data as fallback
        setAgents(mockAgents);
        setTopAgents(mockAgents.slice(0, 3));
        setStats(mockStats);
        setUsingMockData(true);
        
        // Set a user-friendly error message
        setError('Using demo data. Please ensure the backend server is running on port 5000.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // Helper function to process agents data
  const processAgentsData = (data) => {
    if (!data) return [];
    
    // Handle different response structures
    let agentsArray = [];
    if (Array.isArray(data)) {
      agentsArray = data;
    } else if (data?.data && Array.isArray(data.data)) {
      agentsArray = data.data;
    } else if (data?.agents && Array.isArray(data.agents)) {
      agentsArray = data.agents;
    }
    
    return agentsArray.map(agent => ({
      id: agent?._id || agent?.id || Math.random().toString(),
      name: agent?.name || 'Unknown Agent',
      email: agent?.email || 'contact@example.com',
      phone: agent?.agentProfile?.phone || agent?.phone || '(555) 000-0000',
      avatar: agent?.avatar || null, // Changed from '/images/default-avatar.jpg'
      title: agent?.agentProfile?.brokerage || agent?.title || 'Real Estate Agent',
      office: agent?.agentProfile?.brokerage || agent?.office || 'Independent',
      rating: agent?.stats?.rating ? agent.stats.rating.toFixed(1) : '4.5',
      reviews: agent?.stats?.reviews || 0,
      experience: `${agent?.stats?.experience || agent?.agentProfile?.yearsOfExperience || 0} years`,
      specializations: agent?.agentProfile?.specializations || [],
      languages: agent?.agentProfile?.languages || []
    }));
  };

  // Helper function to process stats data
  const processStatsData = (data) => {
    if (!data) return mockStats;
    
    return {
      totalAgents: data?.totalAgents || data?.agents || 0,
      totalPropertiesSold: data?.totalPropertiesSold || data?.propertiesSold || 0,
      averageRating: data?.averageRating || data?.rating || 4.5
    };
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <AgentCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Show warning if using mock data */}
      {usingMockData && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Demo Mode:</strong> Displaying sample data. Backend server may not be running.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <HeroSection
        backgroundImage="/images/04.jpg"
        headline="Find Your Perfect Real Estate Agent"
        subheadline="Connect with experienced professionals in your area"
        primaryCtaText="Browse Agents"
        primaryCtaHref="#agents-list"
        secondaryCtaText="Learn More"
        secondaryCtaHref="#about-agents"
      />

    
      {/* Top Agents Section */}
      {topAgents.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Top Performing Agents</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topAgents.map((agent) => (
                <div key={agent.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="text-center">
                    <img
                      src={agent.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDEzLjk5IDcuMDEgMTUuNjIgNiAxOEMxMC4wMSAyMCAxMy45OSAyMCAxOCAxOEMxNi45OSAxNS42MiAxNC42NyAxMy45OSAxMiAxNFoiIGZpbGw9IiM5QjlCQTAiLz4KPC9zdmc+Cjwvc3ZnPgo='}
                      alt={agent.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDEzLjk5IDcuMDEgMTUuNjIgNiAxOEMxMC4wMSAyMCAxMy45OSAyMCAxOCAxOEMxNi45OSAxNS42MiAxNC42NyAxMy45OSAxMiAxNFoiIGZpbGw9IiM5QjlCQTAiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                      }}
                    />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{agent.name}</h3>
                    <p className="text-gray-600 mb-2">{agent.title}</p>
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-gray-600">{agent.rating} ({agent.reviews} reviews)</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{agent.experience}</p>
                    {/* Removed contact information for privacy */}
                    {/* 
                    <div className="space-y-2">
                      <a href={`tel:${agent.phone}`} className="block text-blue-600 hover:text-blue-800">
                        {agent.phone}
                      </a>
                      <a href={`mailto:${agent.email}`} className="block text-blue-600 hover:text-blue-800">
                        {agent.email}
                      </a>
                    </div>
                    */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Agents Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">All Agents</h2>
          {agents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No agents available at the moment.</p>
              <button 
                onClick={handleRetry}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="text-center">
                    <img
                      src={agent.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDEzLjk5IDcuMDEgMTUuNjIgNiAxOEMxMC4wMSAyMCAxMy45OSAyMCAxOCAxOEMxNi45OSAxNS42MiAxNC42NyAxMy45OSAxMiAxNFoiIGZpbGw9IiM5QjlCQTAiLz4KPC9zdmc+Cjwvc3ZnPgo='}
                      alt={agent.name}
                      className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDEzLjk5IDcuMDEgMTUuNjIgNiAxOEMxMC4wMSAyMCAxMy45OSAyMCAxOCAxOEMxNi45OSAxNS42MiAxNC42NyAxMy45OSAxMiAxNFoiIGZpbGw9IiM5QjlCQTAiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                      }}
                    />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{agent.name}</h3>
                    <p className="text-gray-600 mb-2">{agent.title}</p>
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-gray-600 text-sm">{agent.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{agent.office}</p>
                    {/* Removed contact information for privacy */}
                    {/* 
                    <div className="space-y-1">
                      <a href={`tel:${agent.phone}`} className="block text-blue-600 hover:text-blue-800 text-sm">
                        {agent.phone}
                      </a>
                      <a href={`mailto:${agent.email}`} className="block text-blue-600 hover:text-blue-800 text-sm">
                        {agent.email}
                      </a>
                    </div>
                    */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}