# API Integration Documentation

This document outlines the new API integration structure for the OnlyIf real estate platform, including mock API endpoints, loading states, error handling, and usage examples.

## Table of Contents

1. [Overview](#overview)
2. [API Structure](#api-structure)
3. [Loading Skeletons](#loading-skeletons)
4. [Error Handling](#error-handling)
5. [Usage Examples](#usage-examples)
6. [Migration Guide](#migration-guide)

## Overview

The new API integration provides a structured approach to data fetching with:
- **Mock API endpoints** that simulate real network calls with delays
- **Loading skeletons** for better user experience during data loading
- **Comprehensive error handling** with retry mechanisms
- **TypeScript interfaces** for type safety
- **Easy migration path** to real backend APIs

## API Structure

### Folder Structure
```
src/
├── api/
│   ├── index.ts          # Main API exports
│   ├── properties.ts     # Property-related API calls
│   ├── testimonials.ts   # Testimonial-related API calls
│   ├── agents.ts         # Agent-related API calls
│   ├── contact.ts        # Contact form API calls
│   └── offers.ts         # Offer-related API calls
├── types/
│   └── api.ts           # TypeScript interfaces
└── components/
    └── ui/
        ├── LoadingSkeleton.tsx  # Loading skeleton components
        └── ErrorMessage.tsx     # Error handling components
```

### API Modules

#### Properties API (`src/api/properties.ts`)
```typescript
import { propertiesApi } from '@/api';

// Get all properties with filtering and pagination
const result = await propertiesApi.getProperties(filters, pagination);

// Get a single property by ID
const property = await propertiesApi.getPropertyById('property-1');

// Get featured properties
const featured = await propertiesApi.getFeaturedProperties(4);

// Search properties
const searchResults = await propertiesApi.searchProperties({
  query: 'Austin',
  filters: { propertyType: 'Single Family' },
  pagination: { page: 1, limit: 12 }
});

// Get property statistics
const stats = await propertiesApi.getPropertyStats();

// Get filter options
const filterOptions = await propertiesApi.getFilterOptions();
```

#### Testimonials API (`src/api/testimonials.ts`)
```typescript
import { testimonialsApi } from '@/api';

// Get all testimonials
const testimonials = await testimonialsApi.getTestimonials(10);

// Get featured testimonials
const featured = await testimonialsApi.getFeaturedTestimonials(3);

// Get testimonials by property type
const propertyTypeTestimonials = await testimonialsApi.getTestimonialsByPropertyType('Single Family');

// Get testimonials by location
const locationTestimonials = await testimonialsApi.getTestimonialsByLocation('Austin, TX');

// Get testimonial statistics
const stats = await testimonialsApi.getTestimonialStats();
```

#### Agents API (`src/api/agents.ts`)
```typescript
import { agentsApi } from '@/api';

// Get all agents
const agents = await agentsApi.getAgents();

// Get agent by ID
const agent = await agentsApi.getAgentById('agent-1');

// Get top performing agents
const topAgents = await agentsApi.getTopAgents(5);

// Get agents by specialization
const specialists = await agentsApi.getAgentsBySpecialization('Luxury Properties');

// Search agents
const searchResults = await agentsApi.searchAgents('Sarah Johnson');

// Get agent statistics
const stats = await agentsApi.getAgentStats();
```

#### Contact API (`src/api/contact.ts`)
```typescript
import { contactApi } from '@/api';

// Submit contact form
const response = await contactApi.submitContactForm({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  subject: 'General Inquiry',
  message: 'I would like to learn more about your services.'
});

// Get all contact submissions (admin)
const submissions = await contactApi.getContactSubmissions();

// Get contact submission by ID
const submission = await contactApi.getContactSubmissionById('contact-123');

// Get contact statistics
const stats = await contactApi.getContactStats();
```

#### Offers API (`src/api/offers.ts`)
```typescript
import { offersApi } from '@/api';

// Submit offer request
const response = await offersApi.submitOfferRequest({
  address: '123 Main St',
  zipCode: '12345',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '555-123-4567'
});

// Get offer by ID
const offer = await offersApi.getOfferById('OFF-123456789');

// Get offers by email
const userOffers = await offersApi.getOffersByEmail('john@example.com');

// Update offer status
const updateResult = await offersApi.updateOfferStatus('OFF-123456789', 'accepted');

// Get offer statistics
const stats = await offersApi.getOfferStats();
```

## Loading Skeletons

### Available Skeleton Components

```typescript
import {
  PropertyCardSkeleton,
  PropertyGridSkeleton,
  PropertyDetailSkeleton,
  TestimonialSkeleton,
  AgentCardSkeleton,
  FormSkeleton,
  TableSkeleton,
  HeroSkeleton,
  StatsSkeleton
} from '@/components';
```

### Usage Examples

#### Property Grid Loading
```tsx
'use client';
import { useState, useEffect } from 'react';
import { propertiesApi } from '@/api';
import { PropertyGridSkeleton, LoadingError } from '@/components';

export default function PropertyGrid() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        const result = await propertiesApi.getProperties();
        setProperties(result.properties);
      } catch (err) {
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  if (loading) {
    return <PropertyGridSkeleton count={8} />;
  }

  if (error) {
    return <LoadingError message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(property => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
  );
}
```

#### Property Detail Loading
```tsx
'use client';
import { useState, useEffect } from 'react';
import { propertiesApi } from '@/api';
import { PropertyDetailSkeleton, LoadingError } from '@/components';

export default function PropertyDetail({ id }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        const data = await propertiesApi.getPropertyById(id);
        if (!data) {
          setError('Property not found');
        } else {
          setProperty(data);
        }
      } catch (err) {
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  if (loading) {
    return <PropertyDetailSkeleton />;
  }

  if (error) {
    return <LoadingError message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div>
      {/* Property detail content */}
    </div>
  );
}
```

## Error Handling

### Error Components

```typescript
import {
  ErrorMessage,
  NetworkError,
  NoResults,
  LoadingError
} from '@/components';
```

### Error Types

#### 1. LoadingError
For general loading failures with retry functionality:
```tsx
<LoadingError 
  message="Failed to load properties"
  onRetry={() => retryFunction()}
/>
```

#### 2. NetworkError
For network connectivity issues:
```tsx
<NetworkError 
  onRetry={() => retryFunction()}
/>
```

#### 3. NoResults
For empty search results:
```tsx
<NoResults 
  message="No properties found"
  suggestion="Try adjusting your search criteria"
/>
```

#### 4. ErrorMessage
For general error messages with different types:
```tsx
<ErrorMessage 
  message="Something went wrong"
  type="error" // 'error' | 'warning' | 'info'
  onRetry={() => retryFunction()}
/>
```

### Error Handling Patterns

#### Try-Catch Pattern
```typescript
const loadData = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await apiFunction();
    setData(data);
  } catch (err) {
    setError(err.message || 'An error occurred');
  } finally {
    setLoading(false);
  }
};
```

#### Error Boundary Pattern
```tsx
'use client';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <LoadingError 
      message={error.message}
      onRetry={resetErrorBoundary}
    />
  );
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

## Usage Examples

### Complete Component Example

```tsx
'use client';
import { useState, useEffect } from 'react';
import { propertiesApi, Property, FilterOptions } from '@/api';
import { 
  PropertyGridSkeleton, 
  LoadingError, 
  NoResults 
} from '@/components';

interface PropertyGridProps {
  showFilters?: boolean;
  itemsPerPage?: number;
}

export default function PropertyGrid({ 
  showFilters = true, 
  itemsPerPage = 12 
}: PropertyGridProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await propertiesApi.getProperties(filters, {
        page: 1,
        limit: itemsPerPage
      });
      
      setProperties(result.properties);
    } catch (err) {
      setError('Failed to load properties. Please try again.');
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [filters, itemsPerPage]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  // Loading state
  if (loading && properties.length === 0) {
    return <PropertyGridSkeleton count={itemsPerPage} />;
  }

  // Error state
  if (error) {
    return (
      <LoadingError 
        message={error}
        onRetry={loadProperties}
      />
    );
  }

  // No results state
  if (!loading && properties.length === 0) {
    return (
      <NoResults 
        message="No properties found"
        suggestion="Try adjusting your filters or search criteria"
      />
    );
  }

  return (
    <div>
      {/* Filters */}
      {showFilters && (
        <FilterBar 
          onFiltersChange={handleFiltersChange}
          currentFilters={filters}
        />
      )}

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>

      {/* Loading overlay for subsequent loads */}
      {loading && properties.length > 0 && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
```

### Server Component Example

```tsx
import { Metadata } from 'next';
import { propertiesApi, testimonialsApi } from '@/api';
import { PropertyGrid } from '@/components';

export const metadata: Metadata = {
  title: 'Featured Properties - OnlyIf',
  description: 'Browse our featured properties',
};

export default async function FeaturedPropertiesPage() {
  // Fetch data on the server
  const [featuredProperties, testimonials] = await Promise.all([
    propertiesApi.getFeaturedProperties(6),
    testimonialsApi.getFeaturedTestimonials(3)
  ]);

  return (
    <div>
      <h1>Featured Properties</h1>
      <PropertyGrid 
        properties={featuredProperties}
        showFilters={false}
      />
      
      <section>
        <h2>What Our Customers Say</h2>
        <TestimonialSlider testimonials={testimonials} />
      </section>
    </div>
  );
}
```

## Migration Guide

### From DataService to API

#### Before (DataService)
```typescript
import { DataService } from '@/utils/dataService';

const properties = await DataService.getProperties();
const testimonials = await DataService.getTestimonials();
```

#### After (API)
```typescript
import { propertiesApi, testimonialsApi } from '@/api';

const result = await propertiesApi.getProperties();
const testimonials = await testimonialsApi.getTestimonials();
```

### Key Changes

1. **Import Changes**: Replace `DataService` imports with specific API modules
2. **Method Names**: Most method names remain the same
3. **Response Structure**: Some methods return different response structures
4. **Error Handling**: Add proper try-catch blocks and loading states
5. **Type Safety**: Use the new TypeScript interfaces

### Migration Checklist

- [ ] Update imports from `@/utils/dataService` to `@/api`
- [ ] Replace `DataService.methodName()` with `apiName.methodName()`
- [ ] Add loading states using skeleton components
- [ ] Implement error handling with error components
- [ ] Update TypeScript interfaces
- [ ] Test all API calls with the new structure

### Benefits of Migration

1. **Better User Experience**: Loading skeletons provide visual feedback
2. **Robust Error Handling**: Comprehensive error states with retry functionality
3. **Type Safety**: Full TypeScript support with proper interfaces
4. **Scalability**: Easy to swap mock APIs with real backend endpoints
5. **Maintainability**: Clear separation of concerns and modular structure

## Next Steps

1. **Real API Integration**: Replace mock delays with actual API calls
2. **Caching**: Implement caching strategies for better performance
3. **Real-time Updates**: Add WebSocket support for live data updates
4. **Offline Support**: Implement offline-first architecture
5. **API Documentation**: Generate OpenAPI/Swagger documentation

## Support

For questions or issues with the API integration:
- Check the example page at `/api-example`
- Review the TypeScript interfaces in `src/types/api.ts`
- Test with the provided mock data and loading states
