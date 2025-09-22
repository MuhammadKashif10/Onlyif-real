'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components';
import Button from '@/components/reusable/Button';
import HeroSection from '@/components/sections/HeroSection';

export default function SellPage() {
  const sellingSteps = [
    {
      step: 1,
      title: 'Create a Seller Account',
      description: 'Sign up for free and get access to our seller dashboard with all the tools you need.',
      icon: '👤'
    },
    {
      step: 2,
      title: 'Add Property Details',
      description: 'Upload photos, write descriptions, and showcase your property\'s best features.',
      icon: '🏠'
    },
    {
      step: 3,
      title: 'Choose Add-Ons',
      description: 'Enhance your listing with professional photos, virtual tours, and premium placement.',
      icon: '📸'
    },
    {
      step: 4,
      title: 'Set Your Price',
      description: 'Use our market analysis tools to price your property competitively.',
      icon: '💰'
    },
    {
      step: 5,
      title: 'Connect with an Agent',
      description: 'Get matched with verified real estate professionals in your area.',
      icon: '🤝'
    },
    {
      step: 6,
      title: 'Close the Deal',
      description: 'Complete the sale with our secure transaction management system.',
      icon: '✅'
    }
  ];

  const sellingPoints = [
    {
      title: 'Fast Listings',
      description: 'Get your property listed and visible to thousands of buyers within 24 hours.',
      icon: '⚡'
    },
    {
      title: 'Verified Agents',
      description: 'Work with pre-screened, licensed real estate professionals with proven track records.',
      icon: '🛡️'
    },
    {
      title: 'Maximum Exposure',
      description: 'Your listing appears on multiple platforms and reaches qualified buyers faster.',
      icon: '📈'
    },
    {
      title: 'Transparent Process',
      description: 'Track every step of your sale with real-time updates and clear communication.',
      icon: '👁️'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection
        backgroundImage="/images/03.jpg"
        headline="Sell Your Home Fast"
        subheadline="Get a cash offer in 24 hours with no fees or commissions"
        primaryCtaText="Get Cash Offer"
        primaryCtaHref="/sell/get-offer"
        secondaryCtaText="Learn More"
        secondaryCtaHref="#how-it-works"
      />

      {/* Step-by-Step Selling Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Step-by-Step Selling Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our streamlined process makes selling your property simple and stress-free.
            </p>
          </div>
          
          {/* Desktop Timeline */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Timeline Line removed */}
              
              <div className="grid grid-cols-6 gap-8">
                {sellingSteps.map((step, index) => (
                  <div key={step.step} className="relative">
                    {/* Step Circle */}
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mx-auto mb-4 relative z-10">
                      {step.step}
                    </div>
                    
                    {/* Step Content */}
                    <div className="text-center">
                      <div className="text-4xl mb-3">{step.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mobile/Tablet Vertical Layout */}
          <div className="lg:hidden space-y-8">
            {sellingSteps.map((step, index) => (
              <div key={step.step} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full text-lg font-bold">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-3xl mb-2">{step.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sell with OnlyIf */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Sell with OnlyIf?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied sellers who chose OnlyIf for their real estate needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sellingPoints.map((point, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{point.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {point.title}
                </h3>
                <p className="text-gray-600">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Showcase Your Property Like a Pro
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our platform provides all the tools you need to present your property in the best light. From professional photography services to virtual tours, we help you attract serious buyers.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Professional photography services
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  360° virtual tours
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Drone aerial photography
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Social media marketing
                </li>
              </ul>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80"
                alt="Professional real estate photography setup in modern home"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Sell Your Property?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful sellers who have used OnlyIf to sell their properties quickly and at the best price.
          </p>
          <Link href="/sell/onboard">
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 border-white text-xl px-12 py-4"
            >
              Start Selling Now
            </Button>
          </Link>
          <div className="mt-8 text-blue-100">
            <p>Already have an account? <Link href="/signin" className="text-white underline hover:no-underline">Sign in here</Link></p>
          </div>
        </div>
      </section>
    </div>
  );
}