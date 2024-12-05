import React, { useState, useEffect } from 'react';
import { Book, Send, PlayCircle, PauseCircle, ChevronRight } from 'lucide-react';
import { generateBookResponse } from '../services/openai';
import { LearningAidSection } from './LearningAid';

const BookLearningApp = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentStep, setCurrentStep] = useState('aim');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [discussionCount, setDiscussionCount] = useState(0);
  
  // Learning goals with clear descriptions
  const learningGoals = [
    {
      title: "Explore Key Ideas",
      description: "Understand the main themes and concepts",
      icon: "🎯"
    },
    {
      title: "Apply to Life",
      description: "Connect insights to personal situations",
      icon: "💡"
    },
    {
      title: "Critical Analysis",
      description: "Analyze writing style and arguments",
      icon: "🔍"
    },
    {
      title: "Historical Context",
      description: "Understand background and influence",
      icon: "📚"
    }
  ];

  // Book overviews aligned with goals
  const bookOverviews = {
    "1984": {
      keyIdeas: {
        background: "A dystopian vision of absolute government control",
        relevance: "Explores surveillance, propaganda, and truth manipulation",
        mainThemes: [
          "The power of surveillance and control",
          "Language as a tool of oppression",
          "The manipulation of truth and history"
        ]
      },
      lifeApplications: {
        background: "A warning about totalitarian control methods",
        relevance: "Modern parallels to privacy and technology",
        mainThemes: [
          "Recognizing manipulation tactics",
          "Importance of independent thinking",
          "Value of personal privacy"
        ]
      },
      analysis: {
        background: "Orwell's masterwork of political fiction",
        relevance: "Pioneering work in dystopian literature",
        mainThemes: [
          "Symbolism of technology and power",
          "Narrative structure and perspective",
          "Language and literary devices"
        ]
      },
      historical: {
        background: "Written in post-WW2 era",
        relevance: "Influenced by totalitarian regimes",
        mainThemes: [
          "Post-war political climate",
          "Rise of surveillance states",
          "Cold War influences"
        ]
      }
    }
  };

  const featuredBooks = [
    { 
      id: 1, 
      title: "1984", 
      author: "George Orwell",
      topics: ["Surveillance & Control", "Language & Truth", "Rebellion"]
    },
    { 
      id: 2, 
      title: "The Great Gatsby", 
      author: "F. Scott Fitzgerald",
      topics: ["American Dream", "Love & Wealth", "Social Class"]
    },
    { 
      id: 3, 
      title: "Atomic Habits", 
      author: "James Clear",
      topics: ["Personal Development", "Habit Formation", "Behavior Change"]
    }
  ];

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setCurrentStep('aim');
    setMessages([
      {
        type: 'assistant',
        content: `What's your goal for reading ${book.title}?`,
        goalOptions: learningGoals
      }
    ]);
  };

  const handleGoalSelect = (goal) => {
    const overview = bookOverviews[selectedBook.title]?.[goal.toLowerCase().replace(/\s+/g, '')] || 
                    bookOverviews[selectedBook.title]?.keyIdeas;
    
    setCurrentStep('listen');
    setMessages(prev => [...prev, 
      {
        type: 'user',
        content: `Goal: ${goal}`
      },
      {
        type: 'assistant',
        content: "Let's start with an overview of the key concepts.",
        overview: overview,
        showPlayButton: true,
        showStartDiscussion: true
      }
    ]);
  };

  const handleStartDiscussion = async () => {
    setCurrentStep('talk');
    try {
      const initialQuestion = "What are the main themes and key points we should discuss?";
      const response = await generateBookResponse(selectedBook, initialQuestion);
      
      setMessages(prev => [...prev, 
        {
          type: 'assistant',
          content: response.content,
          learningAids: response.learningAids,
          prefills: response.prefills
        }
      ]);
      setDiscussionCount(1);
    } catch (error) {
      console.error('Error starting discussion:', error);
      setMessages(prev => [...prev, 
        {
          type: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
        }
      ]);
    }
  };

  const handleQuestionClick = async (question) => {
    try {
      setMessages(prev => [...prev, 
        { type: 'user', content: question },
        { type: 'assistant', content: 'Thinking...', loading: true }
      ]);
      
      const response = await generateBookResponse(selectedBook, question);
      
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          type: 'assistant',
          content: response.content,
          learningAids: response.learningAids,
          prefills: response.prefills
        }
      ]);
      
      setDiscussionCount(prev => prev + 1);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          type: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
        }
      ]);
    }
  };

  const handleStartReflect = () => {
    setCurrentStep('reflect');
    setMessages(prev => [...prev,
      {
        type: 'assistant',
        content: "Let's reflect on what we've learned.",
        showReflectionCard: true,
        reflectionPrompts: [
          "What are your key takeaways from this book?",
          "How might you apply these insights in your life?",
          "What questions do you still have?",
          "Would you like to explore related books?"
        ]
      }
    ]);
  };

  const renderMessage = (message) => (
    <div className={`${
      message.type === 'user' 
        ? 'ml-auto bg-blue-500 text-white' 
        : 'bg-gray-100'
    } p-4 rounded-lg max-w-[80%]`}>
      <p className="mb-4">{message.content}</p>
      
      {/* Goal Selection */}
      {message.goalOptions && (
        <div className="grid grid-cols-1 gap-4">
          {message.goalOptions.map((goal, idx) => (
            <button
              key={idx}
              onClick={() => handleGoalSelect(goal.title)}
              className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm 
                        hover:shadow-md transition-all border border-gray-200"
            >
              <span className="text-2xl">{goal.icon}</span>
              <div>
                <h3 className="font-medium text-gray-900">{goal.title}</h3>
                <p className="text-sm text-gray-600">{goal.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Overview and Audio Player */}
      {message.overview && (
        <div className="mt-4 space-y-4">
          {message.showPlayButton && (
            <div className="flex justify-center mb-6">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-blue-500 hover:text-blue-600"
              >
                {isPlaying ? (
                  <PauseCircle className="w-16 h-16" />
                ) : (
                  <PlayCircle className="w-16 h-16" />
                )}
              </button>
            </div>
          )}

          <div className="space-y-4">
            <section>
              <h3 className="font-medium mb-2">Background</h3>
              <p className="text-gray-600">{message.overview.background}</p>
            </section>
            <section>
              <h3 className="font-medium mb-2">Relevance</h3>
              <p className="text-gray-600">{message.overview.relevance}</p>
            </section>
            <section>
              <h3 className="font-medium mb-2">Key Points</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                {message.overview.mainThemes.map((theme, idx) => (
                  <li key={idx}>{theme}</li>
                ))}
              </ul>
            </section>
          </div>

          {message.showStartDiscussion && (
            <button
              onClick={handleStartDiscussion}
              className="w-full mt-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Start Discussion
            </button>
          )}
        </div>
      )}

      {/* Loading State */}
      {message.loading && (
        <div className="mt-4 flex items-center gap-2 text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          <span>Thinking...</span>
        </div>
      )}

      {/* Learning Aids */}
      {message.learningAids && (
        <div className="mt-4 space-y-3">
          {message.learningAids.map((aid, idx) => (
            <LearningAidSection key={idx} title={aid.title}>
              <div className="text-gray-600">{aid.content}</div>
            </LearningAidSection>
          ))}
        </div>
      )}

      {/* Follow-up Questions */}
      {message.prefills && (
        <div className="mt-4 flex flex-wrap gap-2">
          {message.prefills.map((prefill, idx) => (
            <button
              key={idx}
              onClick={() => handleQuestionClick(prefill)}
              className="px-3 py-1 bg-white text-gray-600 rounded-full text-sm hover:bg-gray-50"
            >
              {prefill}
            </button>
          ))}
        </div>
      )}

      {/* Reflect Button */}
      {message.showReflectButton && (
        <button
          onClick={handleStartReflect}
          className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Start Reflection
        </button>
      )}

      {/* Reflection Card */}
      {message.showReflectionCard && (
        <div className="mt-4 bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-medium text-lg mb-4">Reflection & Notes</h3>
          <textarea
            placeholder="Write your thoughts and takeaways..."
            className="w-full h-32 p-3 border rounded-lg mb-4"
            value={reflectionNotes}
            onChange={(e) => setReflectionNotes(e.target.value)}
          />
          <div className="space-y-3">
            {message.reflectionPrompts?.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuestionClick(prompt)}
                className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    if (discussionCount >= 3 && currentStep === 'talk') {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage?.showReflectButton) {
        setMessages(prev => [...prev,
          {
            type: 'assistant',
            content: "We've had a good discussion. Would you like to reflect on what we've covered?",
            showReflectButton: true
          }
        ]);
      }
    }
  }, [discussionCount, messages, currentStep]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">AI Reading Assistant</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Books Sidebar */}
          <div className="w-72">
            <h2 className="text-lg font-medium mb-4">Books to get you started</h2>
            <div className="space-y-4">
              {featuredBooks.map(book => (
                <div 
                  key={book.id}
                  onClick={() => handleBookSelect(book)}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md 
                           transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Book className="w-5 h-5 text-blue-500" />
                    <div>
                      <h3 className="font-medium">{book.title}</h3>
                      <p className="text-sm text-gray-600">{book.author}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col h-[80vh]">
            {/* Progress Bar */}
            {selectedBook && (
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
                {['aim', 'listen', 'talk', 'reflect'].map((step, idx) => (
                  <div key={step} className="flex items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${currentStep === step ? 'bg-blue-500 text-white' : 'bg-gray-200'}
                    `}>
                      {idx + 1}
                    </div>
                    <span className={`ml-2 ${currentStep === step ? 'text-blue-500' : 'text-gray-500'}`}>
                      {step.charAt(0).toUpperCase() + step.slice(1)}
                    </span>
                    {idx < 3 && <ChevronRight className="mx-2 text-gray-400" />}
                  </div>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, idx) => (
                <div key={idx}>
                  {renderMessage(message)}
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={selectedBook ? "Ask a question..." : "Type a book name..."}
                  className="flex-1 p-2 border rounded-lg"
                />
                <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookLearningApp;