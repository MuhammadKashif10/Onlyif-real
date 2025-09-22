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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Listings</h1>
          <Button onClick={() => router.push('/dashboards/seller/add-property')}>Add New Property</Button>
        </div>
        <div className="text-center py-12">
          <p>Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button onClick={() => router.push('/dashboards/seller/add-property')}>Add New Property</Button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No active listings found</h3>
          <p className="text-gray-500 mb-4">Add your first property to get started!</p>
          <Button onClick={() => router.push('/dashboards/seller/add-property')}>Add New Listing</Button>
        </div>
      ) : (
        <div className="grid gap-6">
    {properties.map((property) => {
      const safeImageUrl = getSafeImageUrl(property.mainImage, "property");

      return (
            <Card key={property.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{property.title}</CardTitle>
             <img
                  src={safeImageUrl}
                  alt={`${property.title} - ${property.address}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // fallback to placeholder instead of hiding
                    target.src = "/images/default-property.jpg";
                  }}
                />
                    <p className="text-gray-600 mt-1">{property.address}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-2xl font-bold text-green-600">
                        ${property.price.toLocaleString()}
                      </span>
                      {getStatusBadge(property.status)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{property.views}</div>
                    <div className="text-sm text-gray-600">Views</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{property.unlocks}</div>
                    <div className="text-sm text-gray-600">Unlocks</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.floor((Date.now() - new Date(property.dateListed).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-gray-600">Days Listed</div>
                  </div>
                </div>

                {property.assignedAgent ? (
                  <AssignedAgentCard 
                    agent={property.assignedAgent}
                    assignedAt={property.assignedAt!}
                    propertyId={property.id}
                  />
                ) : (
                  <Card className="border-dashed border-2 border-gray-300">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <UserPlus className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Agent Assigned
                      </h3>
                      <p className="text-gray-600 text-center mb-4">
                        Assign a professional agent to help optimize your listing and attract more buyers.
                      </p>
                      <Button 
                        onClick={() => handleAssignAgent(property.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign Agent
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
           );
    })}
        </div>
      )}

      <AgentAssignmentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        propertyId={selectedPropertyId || ''}
        onAgentAssigned={handleAgentAssigned}
      />
    </div>
  );
}