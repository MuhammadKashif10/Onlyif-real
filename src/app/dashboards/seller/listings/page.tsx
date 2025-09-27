'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/reusable/Button';
import Badge from '@/components/reusable/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/reusable/EnhancedCard';
import { UserPlus, Eye, Edit, Trash2 } from 'lucide-react';
import { Agent } from '@/types/api';
import AgentAssignmentModal from '@/components/seller/AgentAssignmentModal';
import AssignedAgentCard from '@/components/seller/AssignedAgentCard';
import { useRouter } from 'next/navigation';
import { getSafeImageUrl } from '@/utils/imageUtils';

// Mock property data with assigned agents
const mockProperties = [
  {
    id: '1',
    title: 'Modern Downtown Condo',
    address: '123 Main St, Austin, TX 78701',
    price: 450000,
    status: 'public' as const,
    views: 234,
    unlocks: 12,
    dateListed: '2024-01-15',
    assignedAgent: null,
    assignedAt: null
  },
  {
    id: '2',
    title: 'Spacious Family Home',
    address: '456 Oak Ave, Austin, TX 78702',
    price: 750000,
    status: 'private' as const,
    views: 89,
    unlocks: 5,
    dateListed: '2024-01-20',
    assignedAgent: null,
    assignedAt: null
  }
];

export default function SellerListingsPage() {
  const [properties, setProperties] = useState(mockProperties);
  console.log("🚀 ~ SellerListingsPage ~ properties:", properties)
  const [loading, setLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const router = useRouter();

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        const data = await response.json();
        console.log("🚀 ~ fetchProperties ~ data:", data)
        console.log("🚀 ~ fetchProperties ~ first property:", data.properties?.[0] || data[0])
        
        // Log all keys of the first property to see what fields are available
        const firstProperty = data.properties?.[0] || data[0];
        if (firstProperty) {
          console.log("🚀 ~ Available property fields:", Object.keys(firstProperty));
          console.log("🚀 ~ Full property object:", firstProperty);
        }
        
        if (data.properties) {
          setProperties(data.properties);
        } else if (Array.isArray(data)) {
          setProperties(data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleAssignAgent = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setIsAssignModalOpen(true);
  };

  const handleAgentAssigned = (agent: Agent) => {
    if (selectedPropertyId) {
      setProperties(prev => prev.map(property => 
        property.id === selectedPropertyId 
          ? { 
              ...property, 
              assignedAgent: agent,
              assignedAt: new Date().toISOString()
            }
          : property
      ));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const },
      private: { label: 'Private', variant: 'outline' as const },
      public: { label: 'Public', variant: 'default' as const },
      sold: { label: 'Sold', variant: 'destructive' as const },
      withdrawn: { label: 'Withdrawn', variant: 'secondary' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <Button onClick={() => router.push('/dashboards/seller/add-property')}>
              Add New Property
            </Button>
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-600 mt-2">Manage and track your property listings</p>
          </div>
          <Button 
            onClick={() => router.push('/dashboards/seller/add-property')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm"
          >
            Add New Property
          </Button>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {properties.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="mb-6">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No active listings found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Start building your property portfolio by adding your first listing. It only takes a few minutes to get started.
              </p>
              <Button 
                onClick={() => router.push('/dashboards/seller/add-property')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
              >
                Add Your First Listing
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {properties.map((property, index) => {
                const safeImageUrl = getSafeImageUrl(property.mainImage, "property");

                return (
                  <div key={property.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex gap-6">
                      {/* Left side: Thumbnail image */}
                      <div className="flex-shrink-0">
                        <img
                          src={safeImageUrl}
                          alt={`${property.title} - ${property.address}`}
                          className="w-32 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder-property.jpg';
                          }}
                        />
                      </div>

                      {/* Middle: Property details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {property.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              {property.address}
                            </p>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(property.status)}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                              ${property.price?.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-xl font-bold text-blue-600">
                              {property.views || 0}
                            </div>
                            <div className="text-xs text-gray-600">Views</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-xl font-bold text-green-600">
                              {property.unlocks || 0}
                            </div>
                            <div className="text-xs text-gray-600">Unlocks</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-xl font-bold text-purple-600">
                              {(() => {
                                // Calculate days listed using createdAt from the database
                                const createdAt = property.createdAt;
                                
                                if (!createdAt) {
                                  return 0;
                                }
                                
                                const createdDate = new Date(createdAt);
                                
                                if (isNaN(createdDate.getTime())) {
                                  return 0;
                                }
                                
                                const daysListed = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
                                
                                return Math.max(0, daysListed);
                              })()}
                            </div>
                            <div className="text-xs text-gray-600">Days Listed</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-xl font-bold text-orange-600">
                              {property.offers || 0}
                            </div>
                            <div className="text-xs text-gray-600">Offers</div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>

                          {/* Agent assignment section */}
                          <div>
                            {property.assignedAgent ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Add logic to contact the assigned agent
                                  console.log('Contacting agent:', property.assignedAgent);
                                  // You can add email/phone contact functionality here
                                }}
                                className="flex items-center gap-2 text-green-600 hover:text-green-700"
                              >
                                <UserPlus className="h-4 w-4" />
                                Contact Agent
                              </Button>
                            ) : (
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <UserPlus className="h-4 w-4" />
                                No agent assigned yet
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Agent Assignment Modal */}
        <AgentAssignmentModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          onAgentAssigned={handleAgentAssigned}
          propertyId={selectedPropertyId}
        />
      </div>
    </div>
  );
}