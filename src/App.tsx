import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogLayout from './components/BlogLayout';
import BlogPost from './components/BlogPost';
import Home from './components/Home';
import BlogPostScarpHelper from './components/BlogPostScarpHelper';
import BlogPostAiBattle from './components/BlogPostAiBattle';
import { Analytics } from "@vercel/analytics/react";
import BlogImageClassification from './components/BlogImageClassification';
import ViewersNotification from './components/ViewersNotification';

function App() {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const response = await fetch('https://draminesaid.com/ihpcount.php');
        const data = await response.json();
        setVisitorCount(data.visitorCount);
      } catch (error) {
        console.error('Error fetching visitor count:', error);
      }
    };

    trackVisitor();
  }, []);

  return (
    <Router>
      <Analytics />
      <ViewersNotification/>
      <Routes>
        <Route path="/" element={<BlogLayout />}>
          <Route index element={<Home />} />
          <Route path="/MinimaxAlgo" element={<BlogPost />} />
          <Route path="/ScarpHelper" element={<BlogPostScarpHelper />} />
          <Route path="/AiBattle" element={<BlogPostAiBattle />} />
          <Route path="/Ai" element={<BlogPostAiBattle />} />
          <Route path="/ImageClassification" element={<BlogImageClassification />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
