'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Property } from '@/types/api';
import { usePropertyContext } from '@/context/PropertyContext';
import PropertyCard from '../ui/PropertyCard';
import FilterBar from '../ui/FilterBar';
import Pagination from '../reusable/Pagination';
import { PropertyGridSkeleton } from '../ui/LoadingSkeleton';
import { LoadingError, NoResults } from '../ui/ErrorMessage';
import { getSafeImageUrl } from '@/utils/imageUtils';
import { FilterOptions } from '@/api';
import { formatPropertyAddress, getSearchableAddress } from '@/utils/addressUtils';

interface MapListingsLayoutProps {
  showFilters?: boolean;
  showPagination?: boolean;
  itemsPerPage?: number;
  featuredOnly?: boolean;
  className?: string;
  onPropertyClick?: (property: Property) => void;
}

export default function MapListingsLayout({
  showFilters = true,
  showPagination = true,
  itemsPerPage = 100, // Increase default items per page
  featuredOnly = false,
  className = '',
  onPropertyClick
}: MapListingsLayoutProps) {
  const router = useRouter();
  const {
    state,
    loadProperties,
    setFilters,
    resetPagination
  } = usePropertyContext();

  // Extract from state
  const {
    properties: allProperties,
    loading: contextLoading,
    error: contextError,
    searchResults,
    filters,
    pagination
  } = state;

  // Local state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  // Calculate pagination
  const totalProperties = filteredProperties.length;
  const totalPages = Math.ceil(totalProperties / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  // Load properties on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load all properties without limit
        await loadProperties({
          ...filters,
          featured: featuredOnly ? 'true' : undefined
        });
      } catch (err) {
        console.error('Error loading properties:', err);
        setError('Failed to load properties. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [loadProperties, filters, featuredOnly]);

  // Load properties if not already loaded
  useEffect(() => {
    console.log('🔄 MapListingsLayout - Loading properties...', { allProperties: allProperties?.length });
    if (!allProperties || allProperties.length === 0) {
      loadProperties().then(() => {
        console.log('✅ Properties loaded successfully');
      }).catch((error) => {
        console.error('❌ Failed to load properties:', error);
      });
    }
  }, [allProperties, loadProperties]);

  // Filter properties based on featuredOnly and other criteria
  useEffect(() => {
    let filtered = Array.isArray(allProperties) ? [...allProperties] : [];

    // Apply featured filter if needed
    if (featuredOnly) {
      filtered = filtered.filter(property => property.featured);
    }

    // Apply search query if exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property => 
        property.title?.toLowerCase().includes(query) ||
        property.address?.toLowerCase().includes(query) ||
        property.city?.toLowerCase().includes(query) ||
        property.state?.toLowerCase().includes(query)
      );
    }

    // Apply filters from context
    if (filters) {
      // Handle city/location filter (support both field names)
      if (filters.city || filters.location) {
        const cityFilter = filters.city || filters.location;
        filtered = filtered.filter(property => 
          property.city?.toLowerCase().includes(cityFilter!.toLowerCase())
        );
      }
      
      if (filters.propertyType) {
        filtered = filtered.filter(property => property.propertyType === filters.propertyType);
      }
      
      // Handle price filters (support both formats)
      const minPrice = filters.minPrice || filters.priceMin;
      const maxPrice = filters.maxPrice || filters.priceMax;
      
      if (minPrice) {
        filtered = filtered.filter(property => property.price >= minPrice);
      }
      if (maxPrice) {
        filtered = filtered.filter(property => property.price <= maxPrice);
      }
      
      if (filters.beds) {
        filtered = filtered.filter(property => property.beds >= filters.beds!);
      }
      if (filters.baths) {
        filtered = filtered.filter(property => property.baths >= filters.baths!);
      }
      
      // Handle size filters
      if (filters.minSize) {
        filtered = filtered.filter(property => property.size >= filters.minSize!);
      }
      if (filters.maxSize) {
        filtered = filtered.filter(property => property.size <= filters.maxSize!);
      }
    }

    setFilteredProperties(filtered);
    
    // Reset to first page when filters change
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  }, [allProperties, featuredOnly, searchQuery, filters, currentPage]);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterOptions) => {
    // Convert FilterOptions to PropertySearchParams format
    const searchParams: PropertySearchParams = {
      propertyType: newFilters.propertyType,
      city: newFilters.city,
      location: newFilters.city, // Map city to location for backward compatibility
      minPrice: newFilters.minPrice,
      maxPrice: newFilters.maxPrice,
      priceMin: newFilters.minPrice, // Support both formats
      priceMax: newFilters.maxPrice,
      minSize: newFilters.minSize,
      maxSize: newFilters.maxSize,
      beds: newFilters.beds,
      baths: newFilters.baths,
      sortBy: newFilters.sortBy,
      sortOrder: newFilters.sortOrder
    };
    
    setFilters(searchParams);
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Update pagination in context if needed
  };

  // Handle property selection for map
  const handlePropertySelect = (property: Property) => {
    const propertyId = property._id || property.id;
    setSelectedPropertyId(propertyId);
    if (onPropertyClick) {
      onPropertyClick(property);
    }
  };

  // Handle property card hover (unified function)
  const handlePropertyCardHover = (property: Property | null) => {
    const propertyId = property?._id || property?.id;
    setHoveredPropertyId(propertyId || null);
  };

  // Handle view details navigation
  const handleViewDetails = (property: Property) => {
    const propertySlug = property.slug;
    const propertyId = property._id || property.id;
    if (propertySlug) {
      router.push(`/property/${propertySlug}`);
    } else if (propertyId) {
      router.push(`/property/${propertyId}`);
    } else {
      console.error('Cannot navigate: Property slug or ID not found', property);
    }
  };

  // Add refresh function for error handling
  const refreshProperties = () => {
    loadProperties();
  };

  // Helper function to get property image
  const getPropertyImage = (property: Property): string => {
    if (property.mainImage) {
      return property.mainImage;
    }
    
    if (property.images && property.images.length > 0 && property.images[0].url) {
      return property.images[0].url;
    }
    
    return '/images/default-property.jpg';
  };

  // Helper function to format address
  const formatAddress = (property: Property): string => {
    return property.address || 'Address not available';
  };

  // Enhanced property validation for normalized data
  const isValidProperty = (property: any): property is Property => {
    return (
      property &&
      typeof property === 'object' &&
      typeof property.id === 'string' &&
      typeof property.title === 'string' &&
      typeof property.address === 'string' &&
      typeof property.price === 'number' &&
      typeof property.beds === 'number' &&
      typeof property.baths === 'number'
    );
  };

  // Handle loading state
  if (loading || contextLoading) {
    return (
      <div className={className}>
        <PropertyGridSkeleton count={itemsPerPage} />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className={className}>
        <LoadingError 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  // Handle context error with fallback
  if (contextError && allProperties.length === 0) {
    return (
      <div className={className}>
        <LoadingError 
          message={contextError} 
          onRetry={refreshProperties} 
        />
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-8 ${className}`}>
      {/* Property List Section */}
      <div className="space-y-6">
        {/* Filters */}
        {showFilters && (
          <FilterBar
            onFiltersChange={handleFilterChange}
            onSearchChange={handleSearch}
            currentFilters={filters}
            searchQuery={searchQuery}
          />
        )}

        {/* Results Summary */}
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            {totalProperties === 0 ? 'No properties found' : 
             `Showing ${startIndex + 1}-${Math.min(endIndex, totalProperties)} of ${totalProperties} properties`}
          </p>
        </div>

        {/* Property Grid */}
        {currentProperties.length === 0 ? (
          <NoResults 
            message="No properties match your criteria" 
            onReset={() => {
              setSearchQuery('');
              setFilters({});
              setCurrentPage(1);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProperties.map((property) => {
              if (!isValidProperty(property)) {
                console.warn('Invalid property object:', property);
                return null;
              }

              return (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  slug={property.slug}
                  title={property.title}
                  address={property.address}
                  price={property.price}
                  beds={property.beds}
                  baths={property.baths}
                  size={property.size}
                  image={property.mainImage || '/images/default-property.jpg'}
                  featured={property.featured}
                  onClick={() => handleViewDetails(property)}
                />
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalProperties}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}