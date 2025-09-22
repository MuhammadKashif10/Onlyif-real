'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/types/api';

interface PropertyMapProps {
  properties: Property[];
  selectedPropertyId?: string;
  onPropertySelect?: (property: Property) => void;
  onPropertyHover?: (property: Property | null) => void;
  className?: string;
}

export default function PropertyMap({
  properties,
  selectedPropertyId,
  onPropertySelect,
  onPropertyHover,
  className = ""
}: PropertyMapProps) {
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 30.2672, lng: -97.7431 }); // Default to Austin

  // Calculate map center based on properties with valid coordinates
  useEffect(() => {
    const propertiesWithCoords = properties.filter(p => 
      p.coordinates && 
      typeof p.coordinates.lat === 'number' && 
      typeof p.coordinates.lng === 'number' &&
      !isNaN(p.coordinates.lat) && 
      !isNaN(p.coordinates.lng)
    );
    
    if (propertiesWithCoords.length > 0) {
      const avgLat = propertiesWithCoords.reduce((sum, p) => sum + p.coordinates.lat, 0) / propertiesWithCoords.length;
      const avgLng = propertiesWithCoords.reduce((sum, p) => sum + p.coordinates.lng, 0) / propertiesWithCoords.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
    }
  }, [properties]);

  const handleMarkerClick = (property: Property) => {
    onPropertySelect?.(property);
  };

  const handleMarkerHover = (property: Property | null) => {
    setHoveredPropertyId(property?.id || null);
    onPropertyHover?.(property);
  };

  const formatPrice = (price: number | null | undefined) => {
    if (!price || isNaN(price)) return 'Price on request';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSize = (size: number | null | undefined) => {
    if (!size || isNaN(size)) return 'N/A';
    return size.toLocaleString();
  };

  // Filter properties that have valid coordinates
  const validProperties = properties.filter(property => 
    property.coordinates && 
    typeof property.coordinates.lat === 'number' && 
    typeof property.coordinates.lng === 'number' &&
    !isNaN(property.coordinates.lat) && 
    !isNaN(property.coordinates.lng)
  );

  return (
    <div className={`bg-gray-100 rounded-lg overflow-hidden h-full ${className}`}>
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 relative">
        {/* Map background with grid pattern */}
        <div className="absolute inset-0 bg-gray-200 opacity-20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Property markers - only render properties with valid coordinates */}
        {validProperties.map((property, index) => {
          const isSelected = selectedPropertyId === property._id;
          const isHovered = hoveredPropertyId === property._id;
          
          // Calculate marker position (simplified positioning)
          const x = 20 + (index % 8) * 80;
          const y = 60 + Math.floor(index / 8) * 100;
          
          return (
            <div
              key={property._id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200"
              style={{ left: `${x}px`, top: `${y}px` }}
              onClick={() => handleMarkerClick(property)}
              onMouseEnter={() => handleMarkerHover(property)}
              onMouseLeave={() => handleMarkerHover(null)}
            >
              {/* Price marker */}
              <div className={`
                px-3 py-1 rounded-full text-xs font-semibold shadow-lg transition-all duration-200
                ${isSelected 
                  ? 'bg-blue-600 text-white scale-110' 
                  : isHovered 
                    ? 'bg-blue-500 text-white scale-105'
                    : 'bg-white text-gray-900 hover:bg-blue-50'
                }
              `}>
                {formatPrice(property.price)}
              </div>
              
              {/* Location pin */}
              <div className={`
                w-3 h-3 rounded-full mx-auto mt-1 transition-all duration-200
                ${isSelected 
                  ? 'bg-blue-600 scale-110' 
                  : isHovered 
                    ? 'bg-blue-500 scale-105'
                    : 'bg-red-500'
                }
              `}></div>
              
              {/* Property info tooltip on hover */}
              {isHovered && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                  <div className="bg-white rounded-lg shadow-xl p-3 min-w-48 border">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {property.title || 'Untitled Property'}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {typeof property.address === 'string' ? property.address : 
                       property.address ? `${property.address.street}, ${property.address.city}, ${property.address.state}` : 'Address not available'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {property.beds || 0} bed • {property.baths || 0} bath • {formatSize(property.size)} sqft
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-1">
          <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Properties count indicator */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white rounded-lg shadow-md px-3 py-2">
            <div className="text-sm font-semibold text-gray-900">
              {validProperties.length} {validProperties.length === 1 ? 'home' : 'homes'}
              {properties.length > validProperties.length && (
                <div className="text-xs text-gray-500">
                  ({properties.length - validProperties.length} without coordinates)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}