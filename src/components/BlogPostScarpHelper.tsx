import React, { useState } from 'react';
import { ArrowLeft, Clock, User, Tag, Copy, Check, ThumbsUp, Share2, Bookmark, MessageCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, title }) => {
  const [copied, setCopied] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  React.useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-4 mb-6">
      {title && (
        <div className="flex items-center justify-between bg-gray-800 rounded-t-lg px-4 py-2 border-b border-gray-700">
          <span className="text-sm text-gray-400">{title}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      )}
      <div className={`relative bg-gray-900 rounded-lg ${!title ? 'rounded-t-lg' : ''} overflow-hidden`}>
        <pre className={`line-numbers ${isExpanded ? 'max-h-none' : 'max-h-[400px]'} overflow-auto`}>
          <code className={`language-${language}`}>{code.trim()}</code>
        </pre>
      </div>
    </div>
  );
};

const ProjectPreview: React.FC<{ url: string }> = ({ url }) => {
  return (
    <div className="mt-8 rounded-xl overflow-hidden border border-gray-700 bg-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-white font-medium">Live Project Preview</h3>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Open in new tab
        </a>
      </div>
      <div className="relative pb-[56.25%] h-0">
        <iframe
          src={url}
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

const BlogPostScarpHelper = () => {

  const post = {
    title: ' Automating Web Scraping with React.js & TensorFlow',
    author: 'Iheb Chebbi',
    date: 'December 12, 2024',
    image: './scarp.png',
    readTime: '5 min read',
    tags: ['React js', 'Data manupilation', 'Scarping'],
    projectUrl: 'https://scarperhelper.vercel.app/',
    content: `
      <p><strong>Web scraping has always been a double-edged sword.</strong> On one hand, it’s an incredibly powerful way to extract data; on the other, digging through complex HTML structures to find the right data can be a tedious and time-consuming task.</p>
      
      <h2>The Problem with Traditional Web Scraping</h2>
      <p>Web scraping often requires developers to navigate HTML trees manually, identifying data points and structuring them in a usable format. This approach can be frustrating and prone to errors, especially with dynamic or deeply nested content.</p>
      
      <h2>The Solution: A Smarter Way to Scrape</h2>
      <p>With my new tool, scraping websites has never been easier or more enjoyable. Here’s what makes it stand out:</p>
      <ul>
        <li><strong>Smart Data Detection with TensorFlow</strong> - TensorFlow enables the tool to analyze HTML structures intelligently, identifying patterns and suggesting the most relevant data points to scrape. This eliminates the need to manually search through HTML code, saving hours of work.</li>
        <li><strong>Intuitive UI with React.js</strong> - A sleek, responsive interface built with React.js allows users to visualize and interact with the data. You can easily pick and choose the elements you want to scrape without needing advanced technical knowledge.</li>
        <li><strong>Flexible Export Options</strong> - Once you’ve selected your data, you can download it in your preferred format—whether that’s JSON, CSV, or another structure. This makes integrating scraped data into your workflows seamless.</li>
        <li><strong>Automation Made Easy</strong> - The tool takes the pain out of repetitive scraping tasks. With just a few clicks, you can automate the process and revisit it whenever you need updated data.</li>
      </ul>
      
      <h2>Why This Matters</h2>
      <p>This tool isn’t just about scraping data—it’s about empowering users. Whether you’re a developer, researcher, or analyst, it simplifies the process so you can focus on what truly matters: analyzing and using the data to drive insights.</p>
      
      <h2>What’s Next?</h2>
      <p>The tool is already proving its value by saving time and reducing the complexity of web scraping. Moving forward, I’m planning to add more advanced features like support for scraping dynamic websites, real-time data updates, and collaboration tools for teams.</p>
      
      <h2>Closing Thoughts</h2>
      <p>Web scraping doesn’t have to be a painful experience. By leveraging modern technologies like React.js and TensorFlow, we can make it smarter, faster, and more enjoyable.</p>
      
      <p>If this sounds like something you’d find helpful, stay tuned for updates—or better yet, let me know your thoughts in the comments!</p>
      
      <p>What challenges have you faced with web scraping? I’d love to hear how you’re tackling them.</p>
    `,
   
    code: {
      example1: {
        title: 'Basic Minimax Algorithm Implementation',
        code: `def minimax(depth, node_index, maximizing_player, values, alpha, beta):
    if depth == 3:
        return values[node_index]
    if maximizing_player:
        best = float('-inf')
        for i in range(2):
            val = minimax(depth + 1, node_index * 2 + i, False, values, alpha, beta)
            best = max(best, val)
            alpha = max(alpha, best)
            if beta <= alpha:
                break
        return best
    else:
        best = float('inf')
        for i in range(2):
            val = minimax(depth + 1, node_index * 2 + i, True, values, alpha, beta)
            best = min(best, val)
            beta = min(beta, best)
            if beta <= alpha:
                break
        return best

values = [3, 5, 6, 9, 1, 2, 0, -1]
print("The optimal value is:", minimax(0, 0, True, values, float('-inf'), float('inf')))`,
      },
      example2: {
        title: 'Minimax Algorithm for Supply Chain Management and Logistics',
        code: `def minimax(depth, node_index, maximizing_player, values, alpha, beta):
    # Base case: when depth reaches the maximum or end of the decision tree, return the value
    if depth == 3:
        return values[node_index]

    # Maximizing player's turn (e.g., supply chain manager trying to maximize profit)
    if maximizing_player:
        best = float('-inf')
        for i in range(2):  # Simulating 2 different strategies (e.g., supply options)
            val = minimax(depth + 1, node_index * 2 + i, False, values, alpha, beta)
            best = max(best, val)
            alpha = max(alpha, best)
            if beta <= alpha:  # Beta cut-off
                break
        return best
    # Minimizing player's turn (e.g., demand fluctuations or costs)
    else:
        best = float('inf')
        for i in range(2):  # Simulating 2 different demand scenarios (e.g., high vs low demand)
            val = minimax(depth + 1, node_index * 2 + i, True, values, alpha, beta)
            best = min(best, val)
            beta = min(beta, best)
            if beta <= alpha:  # Alpha cut-off
                break
        return best

# Example of simulated inventory strategies with costs and profits:
values = [3, 5, 6, 9, 1, 2, 0, -1]
print("Optimal inventory value:", minimax(0, 0, True, values, float('-inf'), float('inf')))`,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
        
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
          
          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm"
                >
                  <Tag className="h-3 w-3 inline-block mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
            
            <div className="flex items-center justify-between text-gray-400 text-sm mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {post.date} · {post.readTime}
                </div>
              </div>
            </div>

            <div className="prose prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />

                        <ProjectPreview url={post.projectUrl} />
          </div>
        </motion.article>
           <footer className="mt-16 border-t border-gray-800 pt-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">About the Author</h3>
              <p className="text-gray-400">
                Iheb Chebbi is a Full Stack Developer specializing in React, Node.js, and AI integration.
                He shares his knowledge and experiences through detailed technical articles and tutorials.
              </p>
            </div>
          
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Follow Me</h3>
              <div className="flex gap-4">
                <a
                  href="https://github.com/ihebchebbi1998tn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/chebbi-iheb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Iheb Chebbi. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BlogPostScarpHelper;
