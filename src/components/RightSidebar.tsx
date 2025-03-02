import React from 'react';
import { Plus, ExternalLink } from 'lucide-react';

export default function RightSidebar() {
  return (
    <div className="space-y-4">
      <NewsSection />
      <TrendingSection />
    </div>
  );
}

function NewsSection() {
  const news = [
    {
      title: 'Tech Industry Sees Major Shift',
      readers: '25,543 readers',
      time: '2h',
    },
    {
      title: 'New AI Breakthrough Announced',
      readers: '15,232 readers',
      time: '4h',
    },
    {
      title: 'Remote Work Trends in 2024',
      readers: '8,766 readers',
      time: '6h',
    },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h2 className="font-semibold text-gray-200 mb-4">LinkedIn News</h2>
      <div className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="group cursor-pointer">
            <h3 className="text-gray-300 group-hover:text-blue-500 font-medium">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500">
              {item.readers} • {item.time} ago
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendingSection() {
  const trending = [
    {
      title: 'Software Engineering',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      connections: 15,
    },
    {
      title: 'Product Design',
      company: 'Design Studio',
      location: 'Remote',
      connections: 8,
    },
    {
      title: 'Data Science',
      company: 'AI Solutions',
      location: 'New York, NY',
      connections: 12,
    },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-200">Add to your feed</h2>
        <ExternalLink className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {trending.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-blue-500">{item.company[0]}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-gray-300 font-medium">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.company}</p>
              <p className="text-sm text-gray-500">{item.location}</p>
              <button className="mt-2 flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-blue-500">
                <Plus className="w-4 h-4" />
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}