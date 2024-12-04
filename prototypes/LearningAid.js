import React, { useState } from 'react';
import { Brain, AlertCircle, Book, ListFilter, Globe, BookOpen, ScrollText } from 'lucide-react';

export const LearningAidCard = ({ type, title, children, options, answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const getIcon = () => {
    switch (type) {
      case 'think': return <Brain className="w-5 h-5 text-purple-500" />;
      case 'why': return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'list': return <ListFilter className="w-5 h-5 text-green-500" />;
      case 'intertextuality': return <Book className="w-5 h-5 text-orange-500" />;
      case 'background': return <ScrollText className="w-5 h-5 text-gray-500" />;
      case 'explore': return <Globe className="w-5 h-5 text-red-500" />;
      case 'guide': return <BookOpen className="w-5 h-5 text-yellow-500" />;
      default: return null;
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'think':
        return (
          <div>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 hover:text-blue-600"
            >
              {isExpanded ? 'Hide answer' : 'Tap to reveal'}
            </button>
            {isExpanded && <div className="mt-2">{children}</div>}
          </div>
        );
        
      case 'test':
        return (
          <div>
            <div className="mb-3">{children}</div>
            <div className="space-y-2">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setShowAnswer(true)}
                  className="w-full p-2 text-left bg-white hover:bg-gray-50 rounded border"
                >
                  {option}
                </button>
              ))}
            </div>
            {showAnswer && (
              <div className="mt-3 text-green-600">
                {answer}
              </div>
            )}
          </div>
        );

      case 'explore':
        return (
          <div className="space-y-2">
            {children.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 hover:bg-gray-50 rounded"
              >
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-gray-500">{item.type}</div>
              </a>
            ))}
          </div>
        );

      default:
        return <div>{children}</div>;
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 my-2">
      <div className="flex items-center gap-2 mb-2">
        {getIcon()}
        <h3 className="font-medium">{title}</h3>
      </div>
      {renderContent()}
    </div>
  );
};