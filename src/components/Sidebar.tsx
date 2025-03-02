import React from 'react';
import { Bookmark, TrendingUp, Users } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="space-y-4">
      <ProfileCard />
      <StatsCard />
      <RecentCard />
    </div>
  );
}

function ProfileCard() {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="h-20 bg-gradient-to-r from-blue-600 to-gray-400" />
      <div className="p-4 -mt-12">
        <img
          src="https://media.licdn.com/dms/image/v2/D4D03AQGtLsIH9wNTlQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1708009946528?e=2147483647&v=beta&t=9OaX5acwCGVyFB955g5KB0FWuBtqtaJaHgu37cvinlg"
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-gray-900 mx-auto"
        />
        <div className="text-center mt-2">
          <h2 className="text-xl font-bold text-gray-200">Iheb Chebbi</h2>
          <p className="text-sm text-gray-400">Software Developer</p>
        </div>
        
        <div className="mt-4 border-t border-gray-800 pt-4">
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-gray-400">Profile views</p>
              <p className="text-blue-500 font-semibold">1,234</p>
            </div>
            <div>
              <p className="text-gray-400">Post impressions</p>
              <p className="text-blue-500 font-semibold">5,678</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard() {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="font-semibold text-gray-200 mb-3">Your Stats</h3>
      <div className="space-y-3">
        <StatItem icon={<TrendingUp />} label="85 search appearances" />
        <StatItem icon={<Users />} label="1,234 connections" />
        <StatItem icon={<Bookmark />} label="45 saved items" />
      </div>
    </div>
  );
}

function RecentCard() {
  const recentItems = [
    'React Development',
    'JavaScript Tips',
    'Web Design Trends',
    'UI/UX Discussion',
    'Tech Career Advice',
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="font-semibold text-gray-200 mb-3">Recent</h3>
      <div className="space-y-3">
        {recentItems.map((item, index) => (
          <button
            key={index}
            className="w-full text-left text-sm text-gray-400 hover:text-blue-500 hover:bg-gray-800 p-2 rounded"
          >
            # {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 text-gray-400 hover:text-blue-500 cursor-pointer">
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
      <span className="text-sm">{label}</span>
    </div>
  );
}