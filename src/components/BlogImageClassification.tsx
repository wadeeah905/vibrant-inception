import React, { useState } from 'react';
import { ArrowLeft, Clock, User, Tag, Copy, Check } from 'lucide-react';
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


const BlogImageClassification = () => {

  const post = {
    title: 'Image Classification with React.js & TensorFlow',
    author: 'Iheb Chebbi',
    date: 'December 10, 2024',
    image: './imageclassi.png',
    readTime: '5 min read',
    tags: ["React.js", "TensorFlow", "Machine Learning", "Image Classification"],
    projectUrl: '',
    content: `
    <p><strong>Image classification is a revolutionary aspect of machine learning.</strong> With tools like TensorFlow.js and React.js, building responsive, client-side applications that classify images in real-time is easier than ever.</p>
    <h2>Introduction to Image Classification</h2>
    <p>Image classification involves training a machine learning model to categorize images into predefined classes. For example, a model can identify if an image contains a dog, cat, or bird. TensorFlow provides a suite of pre-trained models, like MobileNet, which is optimized for quick deployment in web applications using TensorFlow.js.</p>
    <h2>Why React.js and TensorFlow?</h2>
    <ul>
      <li><strong>React.js</strong>: Simplifies building dynamic and interactive UIs, making it a perfect fit for image classification interfaces.</li>
      <li><strong>TensorFlow.js</strong>: A library that allows machine learning models to run directly in the browser, eliminating the need for server-side processing.</li>
      <li><strong>MobileNet</strong>: A lightweight, pre-trained deep learning model, ideal for real-time image classification in web apps.</li>
    </ul>
    <h2>Setting Up the Application</h2>
    <p>To get started, ensure you have the following installed:</p>
    <ul>
      <li>Node.js and npm</li>
      <li>React.js</li>
      <li>TensorFlow.js: Install via <code>npm install @tensorflow/tfjs @tensorflow-models/mobilenet</code>.</li>
    </ul>
    <h2>Core Component: The Image Classifier Hook</h2>
    <p>The <code>useImageClassifier</code> custom hook is the heart of the application. It uses MobileNet for image classification and provides functionality to load the model, classify images, and handle errors.</p>
    <h3>Code Explanation</h3>
    <p>Below is the implementation of the <code>useImageClassifier</code> hook:</p>
    <h3>Features of the Hook</h3>
    <ul>
      <li><strong>Model Initialization</strong>: Loads the MobileNet model asynchronously with customizable options.</li>
      <li><strong>Classification</strong>: Provides a method to classify images using the loaded model.</li>
      <li><strong>Error Handling</strong>: Handles model loading and classification errors gracefully.</li>
      <li><strong>Resource Management</strong>: Disposes of the model when the component unmounts to free up memory.</li>
    </ul>
    <h2>Integrating the Hook in Your Application</h2>
    <p>Here is how you can use the <code>useImageClassifier</code> hook in a React component:</p>
  `,
  content2: `
    <h3>Features of the Hook</h3>
    <ul>
      <li><strong>Model Initialization</strong>: Loads the MobileNet model asynchronously with customizable options.</li>
      <li><strong>Classification</strong>: Provides a method to classify images using the loaded model.</li>
      <li><strong>Error Handling</strong>: Handles model loading and classification errors gracefully.</li>
      <li><strong>Resource Management</strong>: Disposes of the model when the component unmounts to free up memory.</li>
    </ul>
    <h2>Integrating the Hook in Your Application</h2>
    <p>Here is how you can use the <code>useImageClassifier</code> hook in a React component:</p>
  `,
  content3: `
  <h2>Conclusion</h2>
  <p>By combining the power of React.js and TensorFlow.js, you can create intuitive, client-side applications capable of real-time image classification. This approach not only simplifies development but also provides a seamless user experience without the need for backend processing.</p>
`,
    code: {
      example1: {
        title: 'useImageClassifier hook',
        code: `import { useState, useEffect, useCallback } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';


export const useImageClassifier = (options = { version: 2, alpha: 1.0, topK: 5 }) => {
  const [model, setModel] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); s

  useEffect(() => {
    let isMounted = true;

    const loadModel = async () => {
      try {
        setIsLoading(true);
        const loadedModel = await mobilenet.load({ version: options.version, alpha: options.alpha });
        if (isMounted) setModel(loadedModel);
      } catch (err) {
        console.error('Model loading failed:', err);
        if (isMounted) setError('Failed to load model. Please try again later.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadModel();

    return () => {
      isMounted = false;
      if (model) model.dispose(); 
    };
  }, [options.version, options.alpha]);

  const classifyImage = useCallback(
    async (imageElement) => {
      if (!model) {
        console.error('Model is not loaded yet.');
        setError('Model is not ready. Please wait.');
        return null;
      }

      try {
        const predictions = await model.classify(imageElement, options.topK);
        return predictions;
      } catch (err) {
        console.error('Classification failed:', err);
        setError('Image classification failed. Try a different image.');
        return null;
      }
    },
    [model, options.topK]
  );

  return { classifyImage, isLoading, error };
};
    `,
      },
      example2: {
        title: 'useImageClassifier hook',
        code: `import React, { useRef, useState } from 'react';
import { useImageClassifier } from './useImageClassifier';

const ImageClassifier = () => {
  const { classifyImage, isLoading, error } = useImageClassifier();
  const [predictions, setPredictions] = useState([]);
  const imageRef = useRef(null);

  const handleClassify = async () => {
    if (imageRef.current) {
      const results = await classifyImage(imageRef.current);
      setPredictions(results);
    }
  };

  return (
    <div>
      <h1>Image Classification with React & TensorFlow</h1>
      <input type="file" accept="image/*" onChange={(e) => {
        if (e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = () => (imageRef.current.src = reader.result);
          reader.readAsDataURL(e.target.files[0]);
        }
      }} />
      <img ref={imageRef} alt="Uploaded preview" style={{ maxWidth: '300px', marginTop: '20px' }} />
      <button onClick={handleClassify} disabled={isLoading}>Classify Image</button>
      {error && <p>Error: {error}</p>}
      <ul>
        {predictions.map((prediction, index) => (
          <li key={index}>{prediction.className} - {Math.round(prediction.probability * 100)}%</li>
        ))}
      </ul>
    </div>
  );
};

export default ImageClassifier;`,
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

<div className="prose prose-invert" dangerouslySetInnerHTML={{ __html: post.content2 }} />

<CodeBlock
              code={post.code.example2.code}
              language="typescript"
              title={post.code.example2.title}
            />
            <div className="prose prose-invert" dangerouslySetInnerHTML={{ __html: post.content3 }} />
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

export default BlogImageClassification;
