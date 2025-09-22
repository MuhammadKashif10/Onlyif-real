# 🏠 OnlyIf UI Components Library

A comprehensive collection of reusable React components built with Tailwind CSS, inspired by OpenDoor's design patterns. All components are fully responsive, accessible, and follow modern React best practices.

## 📁 Component Structure

```
src/components/
├── layout/           # Layout components (Navbar, Footer)
├── sections/         # Page sections (Hero, PropertyGrid, CTA, Testimonials)
├── ui/              # UI elements (PropertyCard, Loader)
├── reusable/        # Existing reusable components
└── index.ts         # Component exports
```

## 🎯 Layout Components

### Navbar

A responsive navigation bar with mobile menu, user authentication, and smooth scroll effects.

```tsx
import { Navbar } from '@/components';

<Navbar
  logo="/logo.png"
  logoText="OnlyIf"
  navigationItems={[
    { label: 'Buy', href: '/browse' },
    { label: 'Sell', href: '/sell' },
    { label: 'How it Works', href: '/how-it-works' },
  ]}
  ctaText="Get Started"
  ctaHref="/sell/get-offer"
/>
```

**Props:**
- `logo?: string` - Logo image URL
- `logoText?: string` - Logo text (default: "OnlyIf")
- `navigationItems?: Array<{label: string, href: string, isActive?: boolean}>` - Navigation links
- `ctaText?: string` - Call-to-action button text
- `ctaHref?: string` - Call-to-action button link
- `className?: string` - Additional CSS classes

### Footer

A comprehensive footer with navigation links, social media, contact information, and legal links.

```tsx
import { Footer } from '@/components';

<Footer
  logo="/logo.png"
  logoText="OnlyIf"
  description="Sell your home in days, not months."
  sections={[
    {
      title: 'Buy',
      links: [
        { label: 'Browse Homes', href: '/browse' },
        { label: 'Featured Properties', href: '/browse?featured=true' },
      ]
    }
  ]}
  socialLinks={[
    { name: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
    { name: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
  ]}
  contactInfo={{
    phone: '(555) 123-4567',
    email: 'hello@onlyif.com',
    address: '123 Main Street, Austin, TX 78701'
  }}
/>
```

**Props:**
- `logo?: string` - Logo image URL
- `logoText?: string` - Logo text
- `description?: string` - Company description
- `sections?: FooterSection[]` - Navigation sections
- `socialLinks?: SocialLink[]` - Social media links
- `contactInfo?: {phone?, email?, address?}` - Contact information
- `legalLinks?: FooterLink[]` - Legal links
- `copyrightText?: string` - Copyright text
- `className?: string` - Additional CSS classes

## 🎨 Section Components

### HeroSection

A full-screen hero section with background image, compelling headline, and call-to-action buttons.

```tsx
import { HeroSection } from '@/components';

<HeroSection
  backgroundImage="/hero-bg.jpg"
  headline="Sell Your Home in Days, Not Months"
  subheadline="Get a competitive cash offer in 24 hours. No showings, no repairs, no hassle."
  primaryCtaText="Get Cash Offer"
  primaryCtaHref="/sell/get-offer"
  secondaryCtaText="Browse Homes"
  secondaryCtaHref="/browse"
  trustIndicators={[
    { icon: 'check', text: 'No Obligation' },
    { icon: 'clock', text: '24-Hour Response' },
    { icon: 'calendar', text: 'Flexible Close Date' },
  ]}
  onPrimaryCtaClick={() => console.log('Primary CTA clicked')}
  onSecondaryCtaClick={() => console.log('Secondary CTA clicked')}
/>
```

**Props:**
- `backgroundImage?: string` - Background image URL
- `headline: string` - Main headline text
- `subheadline?: string` - Subheadline text
- `primaryCtaText?: string` - Primary CTA button text
- `primaryCtaHref?: string` - Primary CTA button link
- `secondaryCtaText?: string` - Secondary CTA button text
- `secondaryCtaHref?: string` - Secondary CTA button link
- `trustIndicators?: Array<{icon: string, text: string}>` - Trust indicators
- `onPrimaryCtaClick?: () => void` - Primary CTA click handler
- `onSecondaryCtaClick?: () => void` - Secondary CTA click handler
- `className?: string` - Additional CSS classes

### PropertyGrid

A responsive property grid with filtering, sorting, and pagination capabilities.

```tsx
import { PropertyGrid } from '@/components';

<PropertyGrid
  properties={properties}
  loading={false}
  error={null}
  showFilters={true}
  showPagination={true}
  itemsPerPage={12}
  currentPage={1}
  totalPages={5}
  totalProperties={50}
  onPropertyClick={(property) => console.log('Property clicked:', property)}
  onFilterChange={(filters) => console.log('Filters changed:', filters)}
  onPageChange={(page) => console.log('Page changed:', page)}
/>
```

**Props:**
- `properties: Property[]` - Array of property objects
- `loading?: boolean` - Loading state
- `error?: string | null` - Error message
- `showFilters?: boolean` - Show filter bar
- `showPagination?: boolean` - Show pagination
- `itemsPerPage?: number` - Items per page
- `onPropertyClick?: (property: Property) => void` - Property click handler
- `onFilterChange?: (filters: any) => void` - Filter change handler
- `onPageChange?: (page: number) => void` - Page change handler
- `currentPage?: number` - Current page number
- `totalPages?: number` - Total number of pages
- `totalProperties?: number` - Total number of properties
- `className?: string` - Additional CSS classes

### CTASection

A call-to-action section with customizable content, styling, and background options.

```tsx
import { CTASection } from '@/components';

<CTASection
  title="Ready to Sell Your Home?"
  subtitle="Join thousands of satisfied sellers"
  description="Get a competitive cash offer in 24 hours with no obligation."
  primaryCtaText="Get Your Offer"
  primaryCtaHref="/sell/get-offer"
  secondaryCtaText="Learn More"
  secondaryCtaHref="/how-it-works"
  variant="primary"
  alignment="center"
  backgroundImage="/cta-bg.jpg"
  backgroundGradient={true}
  onPrimaryCtaClick={() => console.log('Primary CTA clicked')}
  onSecondaryCtaClick={() => console.log('Secondary CTA clicked')}
/>
```

**Props:**
- `title: string` - Section title
- `subtitle?: string` - Section subtitle
- `description?: string` - Section description
- `primaryCtaText?: string` - Primary CTA button text
- `primaryCtaHref?: string` - Primary CTA button link
- `secondaryCtaText?: string` - Secondary CTA button text
- `secondaryCtaHref?: string` - Secondary CTA button link
- `backgroundImage?: string` - Background image URL
- `backgroundGradient?: boolean` - Show background gradient
- `variant?: 'primary' | 'secondary' | 'dark'` - Color variant
- `alignment?: 'left' | 'center' | 'right'` - Content alignment
- `onPrimaryCtaClick?: () => void` - Primary CTA click handler
- `onSecondaryCtaClick?: () => void` - Secondary CTA click handler
- `className?: string` - Additional CSS classes

### TestimonialSlider

A testimonial carousel with customer reviews, ratings, and navigation controls.

```tsx
import { TestimonialSlider } from '@/components';

<TestimonialSlider
  testimonials={testimonials}
  title="What Our Customers Say"
  subtitle="Real stories from real people who sold their homes with us"
  variant="card"
  autoPlay={true}
  autoPlayInterval={5000}
  showNavigation={true}
  showDots={true}
/>
```

**Props:**
- `testimonials: Testimonial[]` - Array of testimonial objects
- `title?: string` - Section title
- `subtitle?: string` - Section subtitle
- `autoPlay?: boolean` - Enable auto-play
- `autoPlayInterval?: number` - Auto-play interval in milliseconds
- `showNavigation?: boolean` - Show navigation arrows
- `showDots?: boolean` - Show dot navigation
- `variant?: 'default' | 'card' | 'minimal'` - Display variant
- `className?: string` - Additional CSS classes

## 🎨 UI Components

### PropertyCard

A property card component with image, details, and interactive elements.

```tsx
import { PropertyCard } from '@/components';

<PropertyCard
  id="1"
  image="/property-1.jpg"
  title="Modern Downtown Condo"
  address="123 Main St, Austin, TX 78701"
  price={450000}
  beds={2}
  baths={2}
  size={1200}
  featured={true}
  onClick={() => console.log('Property clicked')}
/>
```

**Props:**
- `id: string` - Property ID
- `image: string` - Property image URL
- `title: string` - Property title
- `address: string` - Property address
- `price: number` - Property price
- `beds: number` - Number of bedrooms
- `baths: number` - Number of bathrooms
- `size: number` - Square footage
- `featured?: boolean` - Featured property badge
- `onClick?: () => void` - Click handler
- `className?: string` - Additional CSS classes

### Loader

A loading spinner component with multiple variants and sizes.

```tsx
import { Loader } from '@/components';

<Loader
  size="md"
  variant="spinner"
  color="blue"
/>
```

**Props:**
- `size?: 'sm' | 'md' | 'lg'` - Size variant
- `variant?: 'spinner' | 'dots' | 'pulse'` - Animation variant
- `color?: 'blue' | 'white' | 'gray'` - Color variant
- `className?: string` - Additional CSS classes

## 📱 Responsive Design

All components are built with a mobile-first approach and include responsive breakpoints:

- **sm**: 640px and up
- **md**: 768px and up
- **lg**: 1024px and up
- **xl**: 1280px and up

## ♿ Accessibility Features

- **ARIA Labels**: All interactive elements include proper ARIA labels
- **Keyboard Navigation**: Full keyboard support for all components
- **Focus Management**: Clear focus indicators and proper focus order
- **Screen Reader Support**: Semantic HTML and proper ARIA attributes
- **Color Contrast**: WCAG compliant color schemes
- **Semantic HTML**: Proper use of HTML5 semantic elements

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#0066FF` - Main brand color
- **Secondary Blue**: `#0047B3` - Hover states
- **Dark Blue**: `#1A1A1A` - Headers and text
- **White**: `#FFFFFF` - Backgrounds
- **Light Gray**: `#F8F9FA` - Page backgrounds
- **Medium Gray**: `#6B7280` - Secondary text
- **Dark Gray**: `#374151` - Body text

### Typography
- **Font Stack**: System fonts with fallbacks
- **Headings**: Bold weights with proper hierarchy
- **Body Text**: Regular weight with good readability
- **Responsive**: Font sizes scale with screen size

### Spacing
- **Base Unit**: 8px (0.5rem)
- **Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- **Responsive**: Spacing adjusts for different screen sizes

## 🚀 Usage Examples

### Complete Page Example

```tsx
import {
  Navbar,
  HeroSection,
  PropertyGrid,
  CTASection,
  TestimonialSlider,
  Footer
} from '@/components';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HeroSection
        headline="Sell Your Home in Days, Not Months"
        subheadline="Get a competitive cash offer in 24 hours."
        primaryCtaText="Get Cash Offer"
        primaryCtaHref="/sell/get-offer"
      />
      
      <PropertyGrid
        properties={properties}
        loading={loading}
        totalProperties={properties.length}
      />
      
      <CTASection
        title="Ready to Sell Your Home?"
        description="Get a competitive cash offer in 24 hours."
        primaryCtaText="Get Your Offer"
        primaryCtaHref="/sell/get-offer"
        variant="primary"
      />
      
      <TestimonialSlider
        testimonials={testimonials}
        title="What Our Customers Say"
        variant="card"
      />
      
      <Footer />
    </div>
  );
}
```

### Custom Styling

```tsx
<HeroSection
  headline="Custom Hero"
  className="bg-gradient-to-r from-purple-600 to-pink-600"
/>

<CTASection
  title="Custom CTA"
  variant="dark"
  alignment="left"
  className="border-t-4 border-blue-600"
/>
```

## 🔧 Customization

### Tailwind CSS Classes

All components use Tailwind CSS utility classes and can be customized by:

1. **Adding className props**:
```tsx
<PropertyCard className="border-2 border-red-500" />
```

2. **Extending Tailwind config**:
```js
// tailwind.config.js
module.exports = {
  extend: {
    colors: {
      brand: {
        50: '#eff6ff',
        500: '#0066FF',
        600: '#0047B3',
      }
    }
  }
}
```

3. **Custom CSS**:
```css
/* globals.css */
.custom-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Component Variants

Many components support different variants:

```tsx
// Different CTA variants
<CTASection variant="primary" />   // Blue background
<CTASection variant="secondary" /> // Light background
<CTASection variant="dark" />      // Dark background

// Different testimonial variants
<TestimonialSlider variant="default" /> // Standard layout
<TestimonialSlider variant="card" />    // Card layout
<TestimonialSlider variant="minimal" /> // Minimal layout
```

## 📦 Installation & Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Import components**:
```tsx
import { Navbar, HeroSection, PropertyGrid } from '@/components';
```

3. **Use in your pages**:
```tsx
export default function Page() {
  return (
    <div>
      <Navbar />
      <HeroSection headline="Welcome" />
      <PropertyGrid properties={[]} />
    </div>
  );
}
```

## 🧪 Testing

Components can be tested using:

```tsx
// Component testing
import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components';

test('renders navbar with logo', () => {
  render(<Navbar logoText="OnlyIf" />);
  expect(screen.getByText('OnlyIf')).toBeInTheDocument();
});
```

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Accessibility Guide](https://reactjs.org/docs/accessibility.html)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenDoor Design Inspiration](https://www.opendoor.com)

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Ensure all components are responsive and accessible
3. Add proper TypeScript types for all props
4. Include ARIA labels and semantic HTML
5. Test across different screen sizes and browsers

## 📄 License

This component library is part of the OnlyIf real estate platform and follows the project's licensing terms.
