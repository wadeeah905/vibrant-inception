import React from 'react';
import { ThumbsUp, MessageCircle, Share2, Send, MoreHorizontal } from 'lucide-react';

interface Post {
  id: number;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  time: string;
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-gray-900 rounded-lg shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-200">{post.author.name}</h3>
              <p className="text-sm text-gray-400">{post.author.title}</p>
              <p className="text-xs text-gray-500">{post.time}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-800 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <p className="mt-3 text-gray-300">{post.content}</p>
        
        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="mt-3 rounded-lg w-full object-cover max-h-96"
          />
        )}

        <div className="mt-3 flex items-center gap-4 text-gray-400 text-sm">
          <span>{post.likes} likes</span>
          <span>{post.comments} comments</span>
          <span>{post.shares} shares</span>
        </div>
      </div>

      <div className="border-t border-gray-800 px-4 py-2 flex justify-between">
        <PostButton icon={<ThumbsUp />} label="Like" />
        <PostButton icon={<MessageCircle />} label="Comment" />
        <PostButton icon={<Share2 />} label="Share" />
        <PostButton icon={<Send />} label="Send" />
      </div>
    </div>
  );
}

function PostButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-800 text-gray-400">
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}