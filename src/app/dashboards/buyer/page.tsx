'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useBuyer } from '@/context/BuyerContext';
import Navbar from '@/components/layout/Navbar';
import BuyerProfileSection from '@/components/buyer/BuyerProfileSection';
import NotificationsPanel from '@/components/buyer/NotificationsPanel';
import SavedSearchesSection from '@/components/buyer/SavedSearchesSection';
import RecommendationsSection from '@/components/buyer/RecommendationsSection';
import { Bell, Heart, Search, Eye, Calendar, DollarSign } from 'lucide-react';

interface DashboardStats {
  savedProperties: number;
  viewedProperties: number;
  savedSearches: number;
  unreadNotifications: number;
}

export default function BuyerDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { 
    unlockedProperties,
    viewedProperties, 
    scheduledViewings, 
    activeOffers,
    recentActivity,
    loading,
    error,
    fetchBuyerData
  } = useBuyer();
  
  const [stats, setStats] = useState<DashboardStats>({
    savedProperties: 0,
    viewedProperties: 0,
    savedSearches: 0,
    unreadNotifications: 0
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user && user.role !== 'buyer') {
      router.push('/signin');
      return;
    }

    if (user) {
      fetchBuyerData();
      fetchDashboardStats();
    }
  }, [user, authLoading]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/buyer/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleViewAll = (section: string) => {
    switch (section) {
      case 'unlocked':
        router.push('/buyer/unlocked-properties');
        break;
      case 'saved':
        router.push('/buyer/saved-properties');
        break;
      case 'viewed':
        router.push('/buyer/viewed-properties');
        break;
      case 'viewings':
        router.push('/buyer/scheduled-viewings');
        break;
      case 'offers':
        router.push('/buyer/active-offers');
        break;
      default:
        break;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Notifications */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.name}! Here's your property search overview.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
              >
                <Bell className="h-6 w-6" />
                {stats.unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {stats.unreadNotifications > 9 ? '9+' : stats.unreadNotifications}
                  </span>
                )}
              </button>
            </div>
            
            {/* Profile Button */}
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              My Profile
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Heart className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Unlock Properties</p>
                <p className="text-2xl font-semibold text-gray-900">{unlockedProperties?.length || 0}</p>
                <p className="text-sm text-gray-500">Properties you've unlocked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - keep only Unlock Properties */}
          <div className="lg:col-span-2 space-y-8">
            {/* Unlock Properties */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Unlock Properties</h2>
                </div>
                <button 
                  onClick={() => handleViewAll('unlocked')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="p-6">
                {unlockedProperties && unlockedProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {unlockedProperties.slice(0, 4).map((property) => (
                      <div key={property.id || property._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <img 
                          src={property.images?.[0] || '/images/placeholder.jpg'} 
                          alt={property.title}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                        <h3 className="font-medium text-gray-900 mb-1">{property.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{property.address}</p>
                        <p className="text-lg font-semibold text-blue-600">${property.price?.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No unlocked properties yet</h3>
                    <p className="text-gray-600 mb-4">Start browsing properties and unlock details!</p>
                    <button 
                      onClick={() => router.push('/browse')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Browse Properties
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Removed: Scheduled Viewings */}
          {/* Removed: Active Offers */}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <SavedSearchesSection />
          {/* Removed: Recommended Properties */}
          {/* Removed: Recently Viewed */}
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <NotificationsPanel 
          isOpen={showNotifications} 
          onClose={() => setShowNotifications(false)} 
        />
      )}

      {/* Profile Modal */}
      {showProfile && (
        <BuyerProfileSection 
          isOpen={showProfile} 
          onClose={() => setShowProfile(false)} 
        />
      )}
    </div>
  );
}