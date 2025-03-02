import React from 'react';
import { ThumbsUp, MessageCircle, Share2, Send } from 'lucide-react';
import PostCard from './PostCard';

export default function Feed() {
  const posts = [
    {
      id: 1,
      author: {
        name: 'Sarah Johnson',
        title: 'Senior Software Engineer at Tech Corp',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      },
      content: 'Excited to announce that we ve just launched our new AI-powered feature! 🚀 #Innovation #Tech',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1080',
      likes: 342,
      comments: 28,
      shares: 15,
      time: '2h',
    },
    {
      id: 2,
      author: {
        name: 'Michael Chen',
        title: 'Product Manager at Innovation Labs',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      },
      content: 'Great workshop today on product development strategies! Thanks to everyone who participated. Here are some key takeaways...',
      likes: 156,
      comments: 12,
      shares: 5,
      time: '4h',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-lg p-4 shadow">
        <div className="flex gap-4">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <button
            className="flex-grow px-4 py-2 bg-gray-800 rounded-full text-left text-gray-400 hover:bg-gray-700"
          >
            Start a post
          </button>
        </div>
        <div className="flex justify-between mt-4">
          <PostButton icon={<ThumbsUp className="w-5 h-5" />} label="Like" />
          <PostButton icon={<MessageCircle className="w-5 h-5" />} label="Comment" />
          <PostButton icon={<Share2 className="w-5 h-5" />} label="Share" />
          <PostButton icon={<Send className="w-5 h-5" />} label="Send" />
        </div>
      </div>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function PostButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-400">
      {icon}
      <span>{label}</span>
    </button>
  );
}