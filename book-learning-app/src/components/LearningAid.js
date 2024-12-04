import React, { useState } from 'react';
import { Brain, AlertCircle, Book, ListFilter, Globe, BookOpen, ScrollText, CheckCircle2, ArrowRight } from 'lucide-react';

export const LearningAidCard = ({ type, title, children, options, answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  
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
          <div className="space-y-3">
            <p>{children}</p>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              {isExpanded ? 'Hide reflection prompts' : 'Show reflection prompts'}
            </button>
            {isExpanded && (
              <div className="pl-4 border-l-2 border-blue-200 mt-2">
                Start your reflection here...
              </div>
            )}
          </div>
        );
        
      case 'test':
        return (
          <div className="space-y-3">
            <p className="font-medium">{children}</p>
            <div className="space-y-2">
              {options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedOption(idx);
                    setShowAnswer(true);
                  }}
                  className={`w-full p-3 text-left rounded border transition-colors ${
                    selectedOption === idx
                      ? showAnswer
                        ? 'bg-green-50 border-green-200'
                        : 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {selectedOption === idx && showAnswer && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
            {showAnswer && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg text-green-700">
                {answer}
              </div>
            )}
          </div>
        );

      case 'explore':
      case 'intertextuality':
        return (
          <div className="space-y-3">
            <p>{children}</p>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              {isExpanded ? 'Show less' : 'Explore more'}
            </button>
            {isExpanded && (
              <div className="pl-4 border-l-2 border-blue-200 mt-2">
                <p className="text-gray-600">
                  {type === 'explore' ? 'Related concepts and resources...' : 'Connected works and themes...'}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return <div className="text-gray-600">{children}</div>;
    }
  };

  return (
    <div className={`bg-white border rounded-lg p-4 my-2 ${type === 'test' ? 'space-y-4' : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        {getIcon()}
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      {renderContent()}
    </div>
  );
};