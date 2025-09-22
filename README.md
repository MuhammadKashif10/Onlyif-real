<<<<<<< HEAD
# OnlyIf - Real Estate Platform

A modern, responsive real estate platform built with Next.js 14, TypeScript, and Tailwind CSS, inspired by OpenDoor's design and functionality.

## 🏠 Features

- **Property Browsing**: Search and filter properties with advanced filters
- **Property Details**: Comprehensive property information with image carousels
- **Cash Offers**: Get instant cash offers for your home
- **Responsive Design**: Mobile-first design that works on all devices
- **SEO Optimized**: Built with Next.js App Router for optimal SEO
- **Accessible**: WCAG compliant with proper ARIA labels and semantic HTML

## 📁 Project Structure

```
onlyif-client/
├── public/
│   └── images/                    # Optimized images and assets
├── src/
│   ├── app/                       # Next.js App Router pages
│   │   ├── page.tsx              # Home page
│   │   ├── about/
│   │   │   └── page.tsx          # About page
│   │   ├── browse/
│   │   │   └── page.tsx          # Property browsing page
│   │   ├── contact/
│   │   │   └── page.tsx          # Contact page
│   │   ├── property/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Property details page
│   │   └── example/
│   │       └── page.tsx          # Component showcase page
│   ├── components/                # Reusable React components
│   │   ├── layout/               # Layout components
│   │   │   ├── Navbar.tsx        # Navigation bar
│   │   │   └── Footer.tsx        # Footer component
│   │   ├── sections/             # Page section components
│   │   │   ├── HeroSection.tsx   # Hero section
│   │   │   ├── PropertyGrid.tsx  # Property listings grid
│   │   │   ├── CTASection.tsx    # Call-to-action sections
│   │   │   └── TestimonialSlider.tsx # Testimonial carousel
│   │   ├── ui/                   # UI components
│   │   │   ├── PropertyCard.tsx  # Individual property card
│   │   │   └── Loader.tsx        # Loading indicators
│   │   ├── reusable/             # Existing reusable components
│   │   └── index.ts              # Component exports
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utility functions
│   └── context/                  # React context providers
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#2563eb` (blue-600)
- **Secondary Blue**: `#1d4ed8` (blue-700)
- **Gray Scale**: `#f9fafb` to `#111827`
- **Success Green**: `#10b981` (emerald-500)
- **Warning Yellow**: `#f59e0b` (amber-500)

### Typography
- **Headings**: Inter font family, font-weight 700-900
- **Body Text**: Inter font family, font-weight 400-500
- **Responsive Sizes**: Tailwind's responsive text utilities

### Spacing
- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Section Padding**: `py-16` (64px vertical)
- **Component Spacing**: `gap-6`, `gap-8`, `mb-6`, `mb-8`

## 📱 Pages Overview

### 1. Home Page (`/`)
- **Hero Section**: Compelling headline with dual CTAs
- **Featured Properties**: Grid of 4 featured homes
- **How It Works**: Process explanation with CTA
- **Testimonials**: Customer reviews carousel
- **Final CTA**: Conversion-focused call-to-action

### 2. Property Details Page (`/property/[id]`)
- **Image Carousel**: Full-width property photos
- **Property Information**: Price, beds, baths, size
- **Detailed Description**: Property features and amenities
- **Agent Information**: Contact details and photo
- **Action Buttons**: Schedule tour, make offer, contact agent
- **Map Integration**: Property location display
- **Similar Properties**: Related homes recommendations

### 3. About Page (`/about`)
- **Company Story**: Mission and vision
- **Impact Statistics**: Key metrics display
- **Core Values**: Transparency, innovation, customer-first
- **Team Section**: Leadership profiles with LinkedIn links
- **Customer Testimonials**: Social proof
- **Call-to-Action**: Join the mission

### 4. Contact Page (`/contact`)
- **Contact Methods**: Support, sales, press inquiries
- **Contact Form**: Comprehensive inquiry form
- **Office Locations**: Physical office addresses
- **FAQ Section**: Common questions and answers
- **Multiple CTAs**: Various conversion opportunities

## 🧩 Component Library

### Layout Components

#### Navbar
```tsx
<Navbar
  logo="/logo.png"
  logoText="OnlyIf"
  navigationItems={[
    { label: 'Buy', href: '/browse', isActive: false },
    { label: 'Sell', href: '/sell', isActive: false },
    { label: 'About', href: '/about', isActive: false },
  ]}
  ctaText="Get Started"
  ctaHref="/signin"
/>
```

#### Footer
```tsx
<Footer
  logo="/logo.png"
  logoText="OnlyIf"
  description="Making real estate simple, transparent, and stress-free."
  sections={[...]}
  socialLinks={[...]}
  contactInfo={{...}}
/>
```

### Section Components

#### HeroSection
```tsx
<HeroSection
  backgroundImage="/images/hero-bg.jpg"
  headline="Buy and sell homes with confidence"
  subheadline="OnlyIf makes real estate simple, transparent, and stress-free"
  primaryCtaText="Get a Cash Offer"
  primaryCtaHref="/sell/get-offer"
  secondaryCtaText="Browse Homes"
  secondaryCtaHref="/browse"
  trustIndicators={[...]}
/>
```

#### PropertyGrid
```tsx
<PropertyGrid
  properties={properties}
  showFilters={true}
  itemsPerPage={12}
  showPagination={true}
/>
```

#### CTASection
```tsx
<CTASection
  title="Ready to Get Started?"
  description="Join thousands of homeowners who've simplified their real estate journey."
  primaryCtaText="Get Your Cash Offer"
  primaryCtaHref="/sell/get-offer"
  variant="primary"
  alignment="center"
  backgroundGradient={true}
/>
```

#### TestimonialSlider
```tsx
<TestimonialSlider
  testimonials={testimonials}
  variant="card"
  autoPlay={true}
  interval={5000}
/>
```

### UI Components

#### PropertyCard
```tsx
<PropertyCard
  id="1"
  title="Modern Family Home"
  address="123 Oak Street, Austin, TX"
  price={450000}
  beds={4}
  baths={3}
  size={2400}
  image="/images/property-1.jpg"
  featured={true}
/>
```

#### Loader
```tsx
<Loader
  size="lg"
  variant="spinner"
  color="blue"
/>
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd onlyif-client

# Install dependencies
npm install

# Run the development server
npm run dev
```

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📱 Responsive Design

All pages are fully responsive with breakpoints:
- **sm**: 640px+ (mobile landscape)
- **md**: 768px+ (tablet)
- **lg**: 1024px+ (desktop)
- **xl**: 1280px+ (large desktop)

## ♿ Accessibility Features

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Screen reader support for interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant color ratios
- **Alt Text**: Descriptive alt text for all images

## 🔍 SEO Optimization

- **Metadata**: Dynamic meta tags for each page
- **Open Graph**: Social media sharing optimization
- **Structured Data**: JSON-LD schema markup
- **Sitemap**: Automatic sitemap generation
- **Robots.txt**: Search engine crawling directives

## 🎯 Performance

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Caching**: Static generation and ISR for optimal performance

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## 📦 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@onlyif.com or join our Slack channel.

## 🔄 Changelog

### v1.0.0 (Current)
- Complete page structure with Home, Property Details, About, and Contact pages
- Responsive design system with Tailwind CSS
- Component library with layout, section, and UI components
- SEO optimization with dynamic metadata
- Accessibility features and WCAG compliance
- Performance optimization with Next.js App Router

---

Built with ❤️ by the OnlyIf team
=======
# Onlyif
>>>>>>> 6fd388dc74e901240d8422b9af69cd23dd0e23eb
