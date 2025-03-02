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

const BlogPostAiBattle = () => {

  const post = {
    title: 'Deep Q-Learning vs A* with Neural Guidance',
    author: 'Iheb Chebbi',
    date: 'December 12, 2024',
    image: './ai_battle.avif',
    readTime: '7 min read',
    tags: ['AI', 'Machine Learning', 'Pathfinding'],
    projectUrl: 'https://mazeai.vercel.app/',
    content: `
      <p><strong>Exploring Advanced Pathfinding in AI:</strong> This post delves into two sophisticated techniques used in artificial intelligence for pathfinding — Deep Q-Learning and A* with Neural Guidance.</p>

<h2>Deep Q-Learning</h2>
<p>Deep Q-Learning combines traditional Q-Learning with deep neural networks, enabling agents to learn optimal actions in complex environments through trial and error. It uses neural networks to approximate state-action values, allowing it to handle environments with large or continuous state spaces. Key elements of Deep Q-Learning include:</p>
<ul>
  <li><strong>State Representation:</strong> Converts raw input data into numerical formats that the neural network can process efficiently.</li>
  <li><strong>Experience Replay:</strong> Stores past interactions in a memory buffer to train the network on a randomized sample, improving learning stability.</li>
  <li><strong>Epsilon-Greedy Exploration:</strong> Balances exploration and exploitation by selecting random actions occasionally to explore the environment.</li>
</ul>

<h2>A* with Neural Guidance</h2>
<p>A* algorithm, when augmented with neural networks, predicts heuristic values dynamically, enhancing its efficiency in pathfinding tasks. Neural networks provide a flexible, adaptive heuristic function that can generalize across similar tasks, making A* more powerful in varied or partially known environments.</p>
<ul>
  <li><strong>Dynamic Heuristics:</strong> Neural networks estimate heuristic values based on environmental context, reducing reliance on pre-defined rules.</li>
  <li><strong>Improved Search Efficiency:</strong> By refining the heuristic function, the algorithm focuses more effectively on promising paths.</li>
</ul>

<h2>Comparison and Use Cases</h2>
<p>Understanding the strengths and limitations of these approaches helps in choosing the right tool for specific applications:</p>
<table>
  <thead>
    <tr>
      <th>Criteria</th>
      <th>Deep Q-Learning</th>
      <th>A* with Neural Guidance</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Environment Type</strong></td>
      <td>Dynamic or partially observable</td>
      <td>Static with well-defined goals</td>
    </tr>
    <tr>
      <td><strong>Learning Capability</strong></td>
      <td>Learns optimal strategies over time</td>
      <td>Relies on predefined and neural-based heuristics</td>
    </tr>
    <tr>
      <td><strong>Application</strong></td>
      <td>Game AI, robotics, adaptive systems</td>
      <td>Navigation, planning, static problem-solving</td>
    </tr>
  </tbody>
</table>
<p>While Deep Q-Learning is ideal for environments with undefined or evolving goals, A* with Neural Guidance excels in static environments with clear end goals. The choice between these techniques depends on the problem's nature and constraints.</p>
    `,
    code: {
      example1: {
        title: 'MazeAI Class Implementation in TypeScript',
        code: `import * as tf from '@tensorflow/tfjs';
import { Position, MazeCell } from '../types/maze';

export class MazeAI {
  private model: tf.LayersModel;
  private learningRate = 0.001;
  private gamma = 0.95;
  private epsilon = 0.1;
  private inputSize: number;
  private outputSize = 4; // up, right, down, left

  constructor(inputSize: number) {
    this.inputSize = inputSize;
    this.model = this.createModel();
  }

  private createModel(): tf.LayersModel {
    const model = tf.sequential();
    
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [this.inputSize],
    }));
    
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu',
    }));
    
    model.add(tf.layers.dense({
      units: this.outputSize,
      activation: 'linear',
    }));

    model.compile({
      optimizer: tf.train.adam(this.learningRate),
      loss: 'meanSquaredError',
    });

    return model;
  }

  public async predict(state: number[]): Promise<number> {
    const stateTensor = tf.tensor2d([state], [1, this.inputSize]);
    const prediction = await this.model.predict(stateTensor) as tf.Tensor;
    const actions = await prediction.data();
    stateTensor.dispose();
    prediction.dispose();

    // Epsilon-greedy policy
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * this.outputSize);
    }
    return actions.indexOf(Math.max(...Array.from(actions)));
  }

  public async learn(
    state: number[],
    action: number,
    reward: number,
    nextState: number[],
    done: boolean
  ): Promise<void> {
    const stateTensor = tf.tensor2d([state], [1, this.inputSize]);
    const nextStateTensor = tf.tensor2d([nextState], [1, this.inputSize]);

    const qNext = await this.model.predict(nextStateTensor) as tf.Tensor;
    const qNextData = await qNext.data();
    const maxQNext = done ? 0 : Math.max(...Array.from(qNextData));

    const target = reward + this.gamma * maxQNext;
    const prediction = await this.model.predict(stateTensor) as tf.Tensor;
    const qValues = Array.from(await prediction.data());
    qValues[action] = target;

    await this.model.trainOnBatch(
      stateTensor,
      tf.tensor2d([qValues], [1, this.outputSize])
    );

    stateTensor.dispose();
    nextStateTensor.dispose();
    qNext.dispose();
    prediction.dispose();
  }
}`,
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
            <CodeBlock
              code={post.code.example1.code}
              language="typescript"
              title={post.code.example1.title}
            />

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

export default BlogPostAiBattle;
