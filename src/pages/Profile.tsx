import React from 'react';
import { User, Mail, Phone, Shield, Key } from 'lucide-react';

export default function Profile() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Profile Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-dark-100 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Personal Information</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      className="w-full bg-dark-200 border border-dark-300 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      className="w-full bg-dark-200 border border-dark-300 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      className="w-full bg-dark-200 border border-dark-300 rounded-lg pl-10 pr-4 py-2 text-white focus: outline-none focus:border-primary-500"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Role
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      className="w-full bg-dark-200 border border-dark-300 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      placeholder="Security Guard"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white rounded-lg px-4 py-2 hover:bg-primary-700 transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-dark-100 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  className="w-full bg-dark-200 border border-dark-300 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  className="w-full bg-dark-200 border border-dark-300 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  className="w-full bg-dark-200 border border-dark-300 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white rounded-lg px-4 py-2 hover:bg-primary-700 transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}