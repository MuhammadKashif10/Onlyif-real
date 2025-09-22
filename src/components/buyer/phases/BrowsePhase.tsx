'use client';

import React, { useState, useEffect } from 'react';
import { useBuyerContext } from '@/context/BuyerContext';
import { PropertyGrid } from '@/components';
import Button from '@/components/reusable/Button';
import { Property } from '@/api';
import { useRouter } from 'next/navigation';

export default function BrowsePhase() {
  const router = useRouter();
  const { buyerData, updateBuyerData, nextPhase } = useBuyerContext();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedPropertyData, setSelectedPropertyData] = useState<Property | null>(null);

  // Handle property selection from PropertyGrid
  const handlePropertySelect = (property: Property) => {
    setSelectedPropertyId(property.id);
    setSelectedPropertyData(property);
    
    updateBuyerData({
      selectedProperty: {
        id: property.id,
        title: property.title,
        price: property.price,
        address: property.address
      }
    });
    
    // Navigate to property details page
    router.push(`/property/${property.id}`);
  };

  const handleContinue = () => {
    if (selectedPropertyData) {
      nextPhase();
    }
  };

  // Auto-advance if property is already selected
  useEffect(() => {
    if (buyerData.selectedProperty && !selectedPropertyData) {
      // If we have a selected property in context but not in local state,
      // we might be returning to this phase - sync the states
      setSelectedPropertyId(buyerData.selectedProperty.id);
    }
  }, [buyerData.selectedProperty, selectedPropertyData]);

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse Properties</h2>
        <p className="text-gray-600">Select a property to unlock detailed information</p>
      </div>

      {/* Selected Property Summary */}
      {buyerData.selectedProperty && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-800">
                Selected: {buyerData.selectedProperty.title}
              </h3>
              <p className="text-green-600 text-sm">
                {buyerData.selectedProperty.address} • ${buyerData.selectedProperty.price.toLocaleString()}
              </p>
            </div>
            <Button
              onClick={handleContinue}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              Continue with This Property
            </Button>
          </div>
        </div>
      )}

      {/* Property Grid with proper click handler */}
      <div className="relative">
        <PropertyGrid
          showFilters={true}
          showPagination={true}
          itemsPerPage={12}
          featuredOnly={false}
          onPropertyClick={handlePropertySelect}
          className="property-grid-buyer"
        />
        
        {/* Selection styling */}
        <style jsx global>{`
          .property-grid-buyer .property-card {
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .property-grid-buyer .property-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }
          
          .property-card.selected {
            ring: 2px solid #10b981;
            ring-offset: 2px;
          }
        `}</style>
      </div>

      {!buyerData.selectedProperty && (
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Click on any property above to select it and continue to the next step
          </p>
        </div>
      )}
    </div>
  );
}