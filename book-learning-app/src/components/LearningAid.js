import React, { useState } from 'react';
import { Brain, AlertCircle, Book, ListFilter, Globe, BookOpen, ScrollText, CheckCircle2, ArrowRight } from 'lucide-react';

export const LearningAidSection = ({ title, children }) => (
  <div className="bg-white border rounded-lg p-4 my-2">
    <h3 className="font-medium mb-3">{title}</h3>
    {children}
  </div>
);

export const QuizCard = ({ question, options }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  
  return (
    <div>
      <p className="mb-3">{question}</p>
      <div className="space-y-2">
        {options?.map((option, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedOption(idx);
              setShowAnswer(true);
            }}
            className={`w-full p-2 text-left rounded border ${
              selectedOption === idx ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export const VocabCard = ({ term, definition, content }) => (
  <div className="p-3 bg-blue-50 rounded border border-blue-100">
    {/* Handle both direct term/definition and content-only cases */}
    {term && definition ? (
      <>
        <div className="font-medium text-blue-800 mb-2">{term}</div>
        <div className="text-gray-600">{definition}</div>
      </>
    ) : (
      <div className="text-gray-600">{content}</div>
    )}
  </div>
);

export const MisconceptionCard = ({ misconception, correction, explanation, content }) => (
  <div className="p-3 bg-red-50 rounded border border-red-100">
    {/* Handle both structured and content-only cases */}
    {misconception && correction ? (
      <>
        <div className="flex items-start gap-2 mb-2">
          <div className="text-red-500">✕</div>
          <div className="text-gray-800">{misconception}</div>
        </div>
        <div className="flex items-start gap-2 mb-2">
          <div className="text-green-500">✓</div>
          <div className="text-gray-800">{correction}</div>
        </div>
        {explanation && (
          <div className="mt-2 text-gray-600">{explanation}</div>
        )}
      </>
    ) : (
      <div className="text-gray-600">{content}</div>
    )}
  </div>
);

export const ThinkingPrompt = ({ prompt, hint }) => {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      <p className="mb-2">{prompt}</p>
      <button
        onClick={() => setShowHint(!showHint)}
        className="text-blue-500 hover:text-blue-600"
      >
        {showHint ? 'Hide hint' : 'Show hint'}
      </button>
      {showHint && (
        <div className="mt-2 pl-3 border-l-2 border-blue-200">{hint}</div>
      )}
    </div>
  );
};

export const BookTimeline = ({ events }) => (
  <div className="space-y-4">
    {events.map((event, index) => (
      <div key={index} className="flex gap-4">
        <div className="w-24 font-medium">{event.year}</div>
        <div>
          <div className="font-medium">{event.title}</div>
          {event.description && (
            <div className="text-gray-600">{event.description}</div>
          )}
        </div>
      </div>
    ))}
  </div>
);

// Legacy support for old LearningAidCard usage
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

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {getIcon()}
        <h3 className="font-medium">{title}</h3>
      </div>
      {children}
      {options && (
        <div className="mt-3">
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setShowAnswer(true)}
              className="w-full p-2 text-left hover:bg-gray-50 rounded"
            >
              {option}
            </button>
          ))}
          {showAnswer && answer && (
            <div className="mt-3 text-green-600">{answer}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LearningAidCard;