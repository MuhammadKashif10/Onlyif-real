'use client';

import React from 'react';
import { Navbar } from '@/components';
import Sidebar from '@/components/main/Sidebar';

const SellerAccount = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        logo="/logo.svg"
        logoText=""
        navigationItems={[
          { label: 'Dashboard', href: '/dashboards/seller', isActive: false },
          { label: 'Listings', href: '/dashboards/seller/listings', isActive: false },
          { label: 'Offers', href: '/dashboards/seller/offers', isActive: false },
          { label: 'Analytics', href: '/dashboards/seller/analytics', isActive: false },
        ]}
        ctaText="Account"
        ctaHref="/dashboards/seller/account"
      />
      
      <div className="flex">
        <Sidebar userType="seller" />
        
        <main className="flex-1 ml-64">
          <div className="pt-16 sm:pt-20 md:pt-24">
            {/* Orange Header Section */}
            <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Account Settings
                  </h1>
                  <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                    Manage your account information and preferences.
                  </p>
                </div>
              </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
                  <p className="text-gray-600">Account settings and profile management will be implemented here.</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerAccount;