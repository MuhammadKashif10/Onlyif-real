'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Button from '@/components/reusable/Button';
import Badge from '@/components/reusable/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/reusable/EnhancedCard';
import { UserPlus, Eye, Edit, Trash2 } from 'lucide-react';
import { Agent } from '@/types/api';
import AgentAssignmentModal from '@/components/seller/AgentAssignmentModal';
import AssignedAgentCard from '@/components/seller/AssignedAgentCard';
import { useRouter } from 'next/navigation';
import { getSafeImageUrl } from '@/utils/imageUtils';
import { useAuth } from '@/hooks/useAuth';
import { sellerApi } from '@/api/seller';

export default function SellerListingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Authentication check - redirect if not authenticated or not a seller
  if (!isLoading) {
    if (!user) {
      router.push("/signin");
      return null;
    }
    // if (user.role !== "seller") {
    //   router.push("/signin");
    //   return null;
    // }
  }

  // Fetch seller properties using React Query
  const {
    data: propertiesData,
    isLoading: propertiesLoading,
    error: propertiesError,
    refetch
  } = useQuery({
    queryKey: ["seller-properties", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User ID is required');
      console.log('Fetching properties for seller ID:', user.id);
      const result = await sellerApi.getSellerListings(user.id);
      console.log('API Response:', result);
      return result;
    },
    enabled: !!user && user.role === "seller",
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Show loading spinner while authentication is being resolved
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated or not a seller
  if (!user || user.role !== "seller") {
    return null;
  }

  // Show loading spinner while properties are being fetched
  if (propertiesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your properties...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (propertiesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading properties: {propertiesError.message}</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Get properties from the API response
  const properties = Array.isArray(propertiesData?.data) ? propertiesData.data : [];
  console.log('Properties to display:', properties);
  console.log('Properties count:', properties.length);

  const handleAssignAgent = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setIsAssignModalOpen(true);
  };

  const handleAgentAssigned = (agent: Agent) => {
    if (selectedPropertyId) {
      // Refetch properties to get updated data
      refetch();
    }
    setIsAssignModalOpen(false);
    setSelectedPropertyId(null);
  };

  const handleRemoveAgent = (propertyId: string) => {
    // Refetch properties to get updated data
    refetch();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      public: { color: 'green' as const, text: 'Public' },
      private: { color: 'blue' as const, text: 'Private' },
      pending: { color: 'yellow' as const, text: 'Pending' },
      sold: { color: 'gray' as const, text: 'Sold' },
      withdrawn: { color: 'red' as const, text: 'Withdrawn' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.private;
    return <Badge color={config.color}>{config.text}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-600 mt-2">
              Manage your property listings and track their performance
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/dashboards/seller/add-property')}>
            Add New Property
          </Button>
        </div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-500 mb-6">You haven't created any property listings yet.</p>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/dashboards/seller/add-property')}>
                Create Your First Listing
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: any) => (
              <Card key={property._id || property.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={getSafeImageUrl(property.primaryImage || property.images?.[0]?.url || property.mainImage?.url)}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    {getStatusBadge(property.status)}
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg">{property.title}</CardTitle>
                  <p className="text-gray-600 text-sm">
                    {property.address?.street || property.address}, {property.address?.city || ''}, {property.address?.state || ''}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${property.price?.toLocaleString()}
                  </p>
                </CardHeader>

                <CardContent>
                  {/* Property Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <Eye className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium">{property.views || property.viewCount || 0}</span>
                      </div>
                      <p className="text-xs text-gray-500">Views</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <span className="text-sm font-medium">{property.inquiries || property.unlocks || 0}</span>
                      </div>
                      <p className="text-xs text-gray-500">Inquiries</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <span className="text-sm font-medium">
                          {property.daysOnMarket || 
                            (property.dateListed ? 
                              Math.floor((new Date().getTime() - new Date(property.dateListed).getTime()) / (1000 * 3600 * 24)) 
                              : 0
                            )
                          }
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Days Listed</p>
                    </div>
                  </div>

                  {/* Assigned Agent */}
                  {property.assignedAgent || property.agents?.length > 0 ? (
                    <AssignedAgentCard
                      agent={property.assignedAgent || property.agents?.[0]?.agent}
                      assignedAt={property.assignedAt || property.agents?.[0]?.assignedAt}
                      onRemove={() => handleRemoveAgent(property._id || property.id)}
                    />
                  ) : (
                    <div className="mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignAgent(property._id || property.id)}
                        className="w-full"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign Agent
                      </Button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Agent Assignment Modal */}
        <AgentAssignmentModal
          isOpen={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedPropertyId(null);
          }}
          onAssign={handleAgentAssigned}
          propertyId={selectedPropertyId}
        />
      </div>
    </div>
  );
}