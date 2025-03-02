import React, { useState, useEffect } from 'react';
import { Bot, User } from 'lucide-react';

interface Props {
  type: 'bot' | 'user';
  content: string;
  options?: string[];
  onOptionClick?: (option: string) => void;
  component?: React.ReactNode;
}

const ChatMessage: React.FC<Props> = ({ type, content, options, onOptionClick, component }) => {
  const [displayContent, setDisplayContent] = useState('');
  const [isTyping, setIsTyping] = useState(type === 'bot');

  useEffect(() => {
    let dotsInterval: NodeJS.Timeout;
    let textInterval: NodeJS.Timeout;
    let timer: NodeJS.Timeout;

    if (type === 'bot') {
      setIsTyping(true);
      setDisplayContent('AI is writing');
      dotsInterval = setInterval(() => {
        setDisplayContent((prev) =>
          prev === 'AI is writing...' ? 'AI is writing' : `${prev}.`
        );
      }, 500);
      timer = setTimeout(() => {
        clearInterval(dotsInterval);
        setIsTyping(false);
        let currentText = '';
        textInterval = setInterval(() => {
          if (currentText.length < content.length) {
            currentText = content.slice(0, currentText.length + 1);
            setDisplayContent(currentText);
          } else {
            clearInterval(textInterval);
          }
        }, 20);
      }, 2000);
    } else {
      setDisplayContent(content);
    }

    return () => {
      clearInterval(dotsInterval);
      clearInterval(textInterval);
      clearTimeout(timer);
    };
  }, [content, type]);

  return (
    <div className={`flex gap-3 ${type === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === 'bot' ? 'bg-blue-500/20' : 'bg-gray-700'}`}>
        {type === 'bot' ? (
          <Bot className="h-4 w-4 text-blue-400" />
        ) : (
          <User className="h-4 w-4 text-gray-300" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className={`p-3 rounded-lg ${type === 'bot' ? 'bg-gray-800' : 'bg-blue-500/20'}`}>
          <p className="text-sm text-gray-300">
            {displayContent}
            {isTyping && <span className="inline-block w-2 h-2 bg-blue-400 rounded-full ml-1 animate-pulse" />}
          </p>
        </div>
        {!isTyping && options && (
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => onOptionClick?.(option)}
                className="px-3 py-1 text-sm rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        )}
        {!isTyping && component && <div className="mt-2">{component}</div>}
      </div>
    </div>
  );
};

export default ChatMessage;
