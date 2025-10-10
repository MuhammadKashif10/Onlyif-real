'use client';
import React from 'react';
import { Navbar } from '@/components';
import Sidebar from '@/components/main/Sidebar';
import { useAuth } from '@/hooks/useAuth';

const SellerAccount = () => {
  const { user } = useAuth();

  // Add local state for change password form
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    try {
      setIsSaving(true);
      const { default: request } = await import('@/utils/api');
      const res = await request<{ message: string }>('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setMessage(res.message || 'Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err?.message || 'Failed to change password.');
    } finally {
      setIsSaving(false);
    }
  };

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
                  {/* Seller details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-base font-medium text-gray-900">{user?.name || '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-base font-medium text-gray-900">{user?.email || '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="text-base font-medium text-gray-900">{user?.role ? user.role[0].toUpperCase() + user.role.slice(1) : '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">User ID</p>
                      <p className="text-base font-medium text-gray-900 break-all">{user?.id || '—'}</p>
                    </div>
                  </div>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-lg shadow-md p-8 mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    For security, your existing password cannot be displayed. Use the toggles to view what you type.
                  </p>

                  {error && <div className="mb-4 text-red-600">{error}</div>}
                  {message && <div className="mb-4 text-green-600">{message}</div>}

                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Password</label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type={showCurrent ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent((v) => !v)}
                          className="px-3 py-2 border rounded-md text-sm"
                        >
                          {showCurrent ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">New Password</label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type={showNew ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew((v) => !v)}
                          className="px-3 py-2 border rounded-md text-sm"
                        >
                          {showNew ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Re-enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="px-3 py-2 border rounded-md text-sm"
                        >
                          {showConfirm ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Update Password'}
                    </button>
                  </form>
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