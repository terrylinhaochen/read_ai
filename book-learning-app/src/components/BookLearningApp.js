import React, { useState, useEffect } from 'react';
import { Book, Send, PlayCircle, PauseCircle, ChevronRight } from 'lucide-react';
import { LearningAidSection } from './LearningAid';
import { generateBookResponse } from '../services/openai';

const BookLearningApp = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentStep, setCurrentStep] = useState('aim');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [reflectionNotes, setReflectionNotes] = useState('');

  // Add podcast content
  const podcastContent = {
    "1984": {
      background: "Written in 1949 by George Orwell, this dystopian novel emerged from the ashes of World War II. Orwell's experiences with totalitarianism and propaganda deeply influenced this work...",
      structure: "The novel follows Winston Smith's journey through three distinct parts: his initial awakening to the Party's control, his rebellion through love and forbidden knowledge, and his ultimate confrontation with power...",
      keyPoints: [
        "The concept of doublethink and how it enables political control",
        "The role of technology in surveillance and social control",
        "The power of language manipulation through Newspeak",
        "The destruction of individual identity and human connections"
      ]
    },
    "The Great Gatsby": {
      background: "Published in 1925, The Great Gatsby captures the decadence of the Jazz Age...",
      structure: "The narrative unfolds through Nick Carraway's perspective...",
      keyPoints: [
        "The corruption of the American Dream",
        "The contrast between old and new money",
        "The power of illusion and self-deception",
        "The moral decay of the upper class"
      ]
    },
    "Atomic Habits": {
      background: "Published in 2018, this book synthesizes cutting-edge research in psychology and neuroscience...",
      structure: "The book is organized around four laws of behavior change...",
      keyPoints: [
        "The compound effect of small changes",
        "The role of identity in habit formation",
        "The four laws of behavior change",
        "The importance of environment design"
      ]
    }
  };

  // Add goal descriptions
  const goalDescriptions = {
    "Understand the main themes and concepts": "Explore the core ideas and messages that the author conveys throughout the work.",
    "Apply insights to my life/work": "Connect the book's lessons to your personal experiences and professional development.",
    "Analyze the writing style and structure": "Examine how the author crafts the narrative and uses literary techniques.",
    "Explore historical context and influence": "Understand the book's relationship to its time period and its lasting impact."
  };

  const getGoalDescription = (goal) => {
    return goalDescriptions[goal] || "";
  };

  // Update the learning goals with more user-friendly options
  const learningGoals = [
    {
      title: "Explore Key Ideas",
      description: "Understand the main themes and concepts that make this book influential",
      icon: "🎯"
    },
    {
      title: "Apply to My Life",
      description: "Connect the book's insights to personal or professional situations",
      icon: "💡"
    },
    {
      title: "Critical Analysis",
      description: "Analyze the writing style, arguments, and deeper meanings",
      icon: "🔍"
    },
    {
      title: "Historical Impact",
      description: "Understand the book's context and its influence over time",
      icon: "📚"
    }
  ];

  // Add this near your other constants
  const bookTopics = {
    "1984": [
      "Surveillance & Control",
      "Thought Police",
      "Newspeak",
      "Winston's Rebellion",
      "The Party's Control",
      "Room 101"
    ],
    // Add topics for other books...
  };

  // Update handleBookSelect
  const handleBookSelect = async (book) => {
    setSelectedBook(book);
    setCurrentStep('aim');
    setMessages([
      {
        type: 'assistant',
        content: `What's your goal for reading ${book.title}?`,
        stage: 'aim',
        goalOptions: [
          {
            title: "Understand Core Concepts",
            description: "Master the main themes and key ideas",
            icon: "🎯"
          },
          {
            title: "Personal Application",
            description: "Apply insights to your life or work",
            icon: "💡"
          },
          {
            title: "Critical Analysis",
            description: "Analyze writing style and structure",
            icon: "🔍"
          },
          {
            title: "Historical Context",
            description: "Explore the book's influence and background",
            icon: "📚"
          }
        ]
      }
    ]);
  };

  // Update handleInputSubmit to follow the same structure
  const handleInputSubmit = async () => {
    if (!inputValue.trim()) return;

    const matchedBook = featuredBooks.find(book => 
      book.title.toLowerCase().includes(inputValue.toLowerCase())
    );

    if (matchedBook) {
      // Handle as book selection - use same flow as handleBookSelect
      setSelectedBook(matchedBook);
      setCurrentStep('aim');
      setMessages([
        {
          type: 'assistant',
          content: `What's your goal for reading ${matchedBook.title}?`,
          stage: 'aim',
          goalOptions: [
            {
              title: "Understand Core Concepts",
              description: "Master the main themes and key ideas",
              icon: "🎯"
            },
            {
              title: "Personal Application",
              description: "Apply insights to your life or work",
              icon: "💡"
            },
            {
              title: "Critical Analysis",
              description: "Analyze writing style and structure",
              icon: "🔍"
            },
            {
              title: "Historical Context",
              description: "Explore the book's influence and background",
              icon: "📚"
            }
          ]
        }
      ]);
    } else {
      // Handle as question when no book is selected
      if (!selectedBook) {
        setMessages(prev => [...prev, 
          { type: 'user', content: inputValue },
          { 
            type: 'assistant', 
            content: "To get started, let's select a book to discuss. Here are some suggestions:",
            showGoalOptions: false,
            bookSuggestions: featuredBooks
          }
        ]);
      } else {
        handleQuestionClick(inputValue);
      }
    }
    setInputValue('');
  };

  // Update renderMessage to properly show goals and handle listening section
  const renderMessage = (message) => (
    <div className={`${
      message.type === 'user' 
        ? 'ml-auto bg-blue-500 text-white' 
        : 'bg-gray-100'
    } p-4 rounded-lg max-w-[80%]`}>
      <p className="text-lg font-medium mb-4">{message.content}</p>
      
      {/* Goal Selection */}
      {message.stage === 'aim' && message.goalOptions && (
        <div className="grid grid-cols-1 gap-4 mt-4">
          {message.goalOptions.map((goal, index) => (
            <button
              key={index}
              onClick={() => handleGoalSelection(goal.title)}
              className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm 
                       hover:shadow-md transition-all duration-200 border border-gray-200
                       hover:border-blue-300 text-left group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {goal.icon}
              </span>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">{goal.title}</h3>
                <p className="text-sm text-gray-600">{goal.description}</p>
              </div>
            </button>
          ))}
        </div>
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
            {message.reflectionPrompts.map((prompt, idx) => (
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

      {/* Reflect Button */}
      {message.showReflectButton && (
        <button
          onClick={handleStartReflect}
          className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Start Reflection
        </button>
      )}

      {/* Rest of your existing message content */}
      {message.audioSummary && (
        <div className="mt-4 space-y-4">
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
          
          <div className="space-y-4">
            <section>
              <h3 className="font-medium text-lg mb-2">Background</h3>
              <p className="text-gray-600 leading-relaxed">
                {message.audioSummary.background}
              </p>
            </section>
            
            <section>
              <h3 className="font-medium text-lg mb-2">Structure</h3>
              <p className="text-gray-600 leading-relaxed">
                {message.audioSummary.structure}
              </p>
            </section>
            
            <section>
              <h3 className="font-medium text-lg mb-2">Key Points</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                {message.audioSummary.keyPoints.map((point, idx) => (
                  <li key={idx} className="leading-relaxed">{point}</li>
                ))}
              </ul>
            </section>
          </div>

          <button
            onClick={handleStartDiscussion}
            className="w-full mt-6 py-3 bg-blue-500 text-white rounded-lg 
                     hover:bg-blue-600 transition-colors font-medium"
          >
            Start Discussion
          </button>
        </div>
      )}

      {/* Learning Aids - only show if we have a selected book */}
      {selectedBook && message.learningAids && (
        <div className="mt-4 space-y-3">
          {message.learningAids.map((aid, aidIdx) => (
            <LearningAidSection key={aidIdx} title={aid.title}>
              <div className="text-gray-600">{aid.content}</div>
            </LearningAidSection>
          ))}
        </div>
      )}

      {/* Follow-up Questions - only show if we have a selected book */}
      {selectedBook && message.prefills && message.type === 'assistant' && (
        <div className="mt-4 flex flex-wrap gap-2">
          {message.prefills.map((prefill, i) => (
            <button
              key={i}
              onClick={() => handleQuestionClick(prefill)}
              className="px-3 py-1 bg-white text-gray-600 rounded-full text-sm hover:bg-gray-50"
            >
              {prefill}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Update handleGoalSelection to handle the new goal format
  const handleGoalSelection = async (goalTitle) => {
    try {
      setMessages(prev => [...prev, 
        { type: 'user', content: `Goal: ${goalTitle}` },
        {
          type: 'assistant',
          content: "Let's start with an overview of the key concepts.",
          stage: 'listen',
          audioSummary: {
            title: selectedBook.title,
            background: selectedBook.summary.background,
            structure: selectedBook.summary.structure,
            keyPoints: selectedBook.summary.keyPoints
          },
          showDiscussButton: true
        }
      ]);
      setCurrentStep('listen');
    } catch (error) {
      console.error('Error:', error);
      // Error handling...
    }
  };

  // Update handleStartDiscussion
  const handleStartDiscussion = async () => {
    setCurrentStep('talk');
    try {
      setMessages(prev => [...prev,
        {
          type: 'assistant',
          content: "Let's dive into the discussion. You can explore specific topics from the sidebar or ask any questions.",
          stage: 'talk',
          showTopicsSidebar: true,
          suggestedTopics: bookTopics[selectedBook.title]
        }
      ]);

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
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Add reflection handling
  const handleStartReflect = () => {
    setCurrentStep('reflect');
    setMessages(prev => [...prev,
      {
        type: 'assistant',
        content: "Let's reflect on what we've learned.",
        stage: 'reflect',
        showReflectionCard: true,
        reflectionPrompts: [
          "What are your key takeaways?",
          "How might you apply these insights?",
          "What questions do you still have?",
          "Would you like to explore related books?"
        ]
      }
    ]);
  };

  const handleOptionClick = (option) => {
    if (currentStep === 'aim') {
      handleGoalSelection(option);
    }
  };

  const handleQuestionClick = async (question) => {
    if (!selectedBook) return;
    
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

  const steps = [
    { id: 'aim', label: 'Set Goal' },
    { id: 'listen', label: 'Listen' },
    { id: 'talk', label: 'Discuss' },
    { id: 'reflect', label: 'Reflect' }
  ];

  const renderProgress = () => (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
      {['aim', 'listen', 'talk', 'reflect'].map((step, index) => (
        <div 
          key={step}
          className={`flex items-center ${index !== 0 ? 'ml-4' : ''}`}
        >
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${currentStep === step ? 'bg-blue-500 text-white' : 'bg-gray-200'}
          `}>
            {index + 1}
          </div>
          <span className={`ml-2 ${currentStep === step ? 'text-blue-500' : 'text-gray-500'}`}>
            {step.charAt(0).toUpperCase() + step.slice(1)}
          </span>
          {index < 3 && <ChevronRight className="ml-4 text-gray-400" />}
        </div>
      ))}
    </div>
  );

  // Add this near the top of your component, with other constants
  const featuredBooks = [
    { 
      id: 1, 
      title: "1984", 
      author: "George Orwell",
      topics: ["Surveillance & Control", "Language & Truth", "Rebellion"],
      initialResponse: {
        content: "1984 is a powerful dystopian novel that explores the dangers of totalitarianism. The story follows Winston Smith, a low-ranking party member who begins to question the oppressive rule of Big Brother and the Party.",
        learningAids: [
          {
            type: 'why',
            title: 'Why it matters',
            content: "1984's themes of surveillance and control remain incredibly relevant in our modern digital age, raising important questions about privacy, technology, and government power."
          },
          {
            type: 'think',
            title: 'Stop and think',
            content: "Consider how the Party's methods of control parallel modern surveillance technologies."
          }
        ],
        prefills: [
          "Tell me about Winston Smith",
          "What are the main themes?",
          "How does the story end?"
        ]
      }
    },
    { 
      id: 2, 
      title: "The Great Gatsby", 
      author: "F. Scott Fitzgerald",
      topics: ["American Dream", "Love & Wealth", "Social Class"],
      initialResponse: {
        content: "The Great Gatsby is a masterpiece of American literature that explores the dark side of the American Dream during the Roaring Twenties.",
        learningAids: [
          {
            type: 'why',
            title: 'Why it matters',
            content: "The novel's critique of wealth, excess, and the American Dream remains relevant to modern discussions of inequality and social mobility."
          }
        ],
        prefills: [
          "Who is Jay Gatsby?",
          "What does the green light symbolize?",
          "How does the setting influence the story?"
        ]
      }
    },
    { 
      id: 3, 
      title: "Atomic Habits", 
      author: "James Clear",
      topics: ["Personal Development", "Habit Formation", "Behavior Change"],
      initialResponse: {
        content: "Atomic Habits presents a practical framework for improving every day, focusing on small changes that lead to remarkable results.",
        learningAids: [
          {
            type: 'why',
            title: 'Why it matters',
            content: "Understanding how habits work and how to change them is crucial for personal and professional growth."
          }
        ],
        prefills: [
          "What are the four laws of behavior change?",
          "How do small habits compound over time?",
          "What's the difference between goals and systems?"
        ]
      }
    }
  ];

  // Add this to your message handling logic
  useEffect(() => {
    if (messages.length > 5 && currentStep === 'talk') {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.showReflectButton) {
        setMessages(prev => [...prev,
          {
            type: 'assistant',
            content: "We've covered quite a bit. Would you like to reflect on what we've discussed?",
            showReflectButton: true
          }
        ]);
      }
    }
  }, [messages.length, currentStep]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">AI Reading Assistant</h1>
        </div>
      </header>
  
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-72 space-y-6">
            <div>
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
          </div>
  
          <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col h-[calc(100vh-12rem)]">
            {selectedBook && renderProgress()}
            
            <div className="p-4 border-b">
              <h2 className="font-medium">
                {selectedBook ? `${selectedBook.title} Discussion` : 'Select a Book'}
              </h2>
            </div>

            {/* Scrollable message area */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                {messages.map((message, idx) => (
                  <div key={idx}>
                    <div className={`${
                      message.type === 'user' 
                        ? 'ml-auto bg-blue-500 text-white' 
                        : 'bg-gray-100'
                    } p-4 rounded-lg max-w-[80%]`}>
                      <p>{message.content}</p>
                      
                      {/* Loading State */}
                      {message.loading && (
                        <div className="mt-4 flex items-center gap-2 text-gray-500">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                          <span>Generating response...</span>
                        </div>
                      )}
                      
                      {/* Audio Summary - only show if we have a selected book */}
                      {selectedBook && message.audioSummary && (
                        <div className="mt-4 space-y-4">
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
                          <div className="space-y-4">
                            {message.audioSummary.background && (
                              <section>
                                <h3 className="font-medium mb-2">Background</h3>
                                <p className="text-gray-600">{message.audioSummary.background}</p>
                              </section>
                            )}
                            {message.audioSummary.structure && (
                              <section>
                                <h3 className="font-medium mb-2">Structure</h3>
                                <p className="text-gray-600">{message.audioSummary.structure}</p>
                              </section>
                            )}
                            {message.audioSummary.keyPoints && (
                              <section>
                                <h3 className="font-medium mb-2">Key Points</h3>
                                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                                  {message.audioSummary.keyPoints.map((point, idx) => (
                                    <li key={idx}>{point}</li>
                                  ))}
                                </ul>
                              </section>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setCurrentStep('talk');
                              handleStartDiscussion();
                            }}
                            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4"
                          >
                            Start Discussion
                          </button>
                        </div>
                      )}
                      
                      {/* Learning Aids - only show if we have a selected book */}
                      {selectedBook && message.learningAids && (
                        <div className="mt-4 space-y-3">
                          {message.learningAids.map((aid, aidIdx) => (
                            <LearningAidSection key={aidIdx} title={aid.title}>
                              <div className="text-gray-600">{aid.content}</div>
                            </LearningAidSection>
                          ))}
                        </div>
                      )}

                      {/* Follow-up Questions - only show if we have a selected book */}
                      {selectedBook && message.prefills && message.type === 'assistant' && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {message.prefills.map((prefill, i) => (
                            <button
                              key={i}
                              onClick={() => handleQuestionClick(prefill)}
                              className="px-3 py-1 bg-white text-gray-600 rounded-full text-sm hover:bg-gray-50"
                            >
                              {prefill}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input area - fixed at bottom */}
            <div className="border-t p-4 bg-white">
              <div className="flex gap-2">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleInputSubmit();
                    }
                  }}
                  placeholder={
                    selectedBook 
                      ? "Ask a question..." 
                      : "Type a book name or question..."
                  }
                  className="flex-1 p-2 border rounded-lg"
                />
                <button 
                  onClick={handleInputSubmit}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BookLearningApp;