import React, { useState } from 'react';
import { Book, Upload, Send, PlayCircle, PauseCircle, BookOpen, Brain, Star } from 'lucide-react';
import { 
  LearningAidSection, 
  QuizCard, 
  VocabCard, 
  MisconceptionCard, 
  ThinkingPrompt, 
  BookTimeline 
} from './LearningAid';

const BookLearningApp = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentStep, setCurrentStep] = useState('aim');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [reflectionNotes, setReflectionNotes] = useState('');
  
  const learningGoals = [
    { id: 'knowledge', label: 'Expand Knowledge', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'problem', label: 'Solve a Problem', icon: <Brain className="w-5 h-5" /> }
  ];

  const featuredBooks = [
    { 
      id: 1, 
      title: "1984",
      author: "George Orwell",
      topics: ["Surveillance & Control", "Language & Truth", "Rebellion"],
      summary: {
        background: "Written in 1949 by George Orwell, this dystopian novel reflects the author's concerns about totalitarianism...",
        structure: "The book is divided into three parts, following protagonist Winston Smith's rebellion...",
        keyPoints: [
          "The concept of doublethink and thought control",
          "The role of technology in surveillance",
          "The manipulation of language through Newspeak"
        ]
      },
      chapters: [
        {
          title: "Part 1: The World of Oceania",
          concepts: ["Big Brother", "Thought Police", "The Ministry of Truth"],
          keyIdeas: ["The nature of reality control", "The power of surveillance"]
        },
        {
          title: "Part 2: The Resistance",
          concepts: ["Julia", "The Brotherhood", "Room 101"],
          keyIdeas: ["Love as rebellion", "The nature of resistance"]
        },
        {
          title: "Part 3: The Consequences",
          concepts: ["Torture", "Betrayal", "Victory over Self"],
          keyIdeas: ["The power of pain", "The destruction of the individual"]
        }
      ]
    },
    {
      id: 2,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      topics: ["American Dream", "Wealth & Society", "Love & Loss"],
      summary: {
        background: "Published in 1925, The Great Gatsby captures the excesses of the Jazz Age...",
        structure: "The narrative follows Nick Carraway's summer among the wealthy...",
        keyPoints: [
          "The corruption of the American Dream",
          "The hollowness of the upper class",
          "The power of obsession and desire"
        ]
      },
      chapters: [
        {
          title: "Chapter 1: The Carraway Effect",
          concepts: ["Nick's Perspective", "The Buchanans", "East vs West"],
          keyIdeas: ["Moral relativism", "Old money vs new money"]
        },
        {
          title: "Chapter 2-3: The Parties",
          concepts: ["Gatsby's Mansion", "The Valley of Ashes", "The Eyes of T.J. Eckleburg"],
          keyIdeas: ["Superficiality of society", "The decay beneath the glamour"]
        }
      ]
    },
    {
      id: 3,
      title: "Atomic Habits",
      author: "James Clear",
      topics: ["Personal Development", "Habit Formation", "Behavior Change"],
      summary: {
        background: "A comprehensive guide to building good habits and breaking bad ones...",
        structure: "Organized around the four laws of behavior change...",
        keyPoints: [
          "The compound effect of small changes",
          "The four laws of behavior change",
          "Identity-based habits"
        ]
      },
      chapters: [
        {
          title: "The Fundamentals",
          concepts: ["Habit Loops", "Compound Growth", "Identity Change"],
          keyIdeas: ["1% Better Every Day", "Systems vs Goals"]
        },
        {
          title: "The Four Laws of Behavior Change",
          concepts: ["Make it Obvious", "Make it Attractive", "Make it Easy", "Make it Satisfying"],
          keyIdeas: ["Environment Design", "Habit Stacking", "Temptation Bundling"]
        }
      ]
    }
];

  const handleBookSelect = async (book, inputText = '') => {
    const newBook = inputText ? { 
      title: inputText,
      author: 'Unknown',
      topics: []
    } : book;
    
    setSelectedBook(newBook);
    setMessages([
      {
        type: 'assistant',
        content: `Let's explore ${newBook.title}. What's your goal for reading this book?`,
        options: [
          'Understand the main themes and concepts',
          'Apply insights to my life/work',
          'Analyze the writing style and structure',
          'Custom goal (type below)'
        ]
      }
    ]);
  };

  const handleStartListening = () => {
    // TODO: Implement these functions in the UI
  };

  const handleStartDiscussion = () => {
    setCurrentStep('talk');
    setMessages(prev => [...prev, {
      type: 'assistant',
      content: "Great! Now that we have an overview, what would you like to explore about the book?",
      learningAids: [
        {
          type: 'think',
          title: 'Suggested Topics',
          content: "You can ask about themes, characters, symbolism, or any specific passage.",
        }
      ],
      prefills: [
        "What are the main themes?",
        "Tell me about the characters",
        "How does the story develop?"
      ]
    }]);
  };

  const handleInputSubmit = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { type: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    if (!selectedBook) {
      // Check if it's a book title or a question
      if (inputValue.toLowerCase().includes('what') || 
          inputValue.toLowerCase().includes('how') ||
          inputValue.toLowerCase().includes('why')) {
        await handleBookSelect({ title: 'Custom Discussion', author: '', topics: [] });
      } else {
        await handleBookSelect(null, inputValue);
      }
      return;
    }

    // ... rest of the handleInputSubmit function ...
  };

  const renderMessage = (message) => (
    <div className={`${
      message.type === 'user' 
        ? 'ml-auto bg-blue-500 text-white' 
        : 'bg-gray-100'
    } p-4 rounded-lg max-w-[80%]`}>
      <p className="mb-4">{message.content}</p>
      
      {message.audioSummary && (
        <div className="mt-4 space-y-4">
          <div className="flex justify-center mb-6">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-blue-500 hover:text-blue-600 transform transition-transform hover:scale-110"
            >
              {isPlaying ? (
                <PauseCircle className="w-16 h-16" />
              ) : (
                <PlayCircle className="w-16 h-16" />
              )}
            </button>
          </div>
          {/* Audio summary content */}
          <div className="space-y-4">
            {message.audioSummary.background && (
              <section>
                <h3 className="font-medium mb-2">Background</h3>
                <p className="text-gray-600">{message.audioSummary.background}</p>
              </section>
            )}
          </div>
          <button
            onClick={handleStartDiscussion}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4"
          >
            Start Discussion
          </button>
        </div>
      )}
      
      {/* ... existing message rendering logic ... */}
    </div>
  );

  const renderAimStep = () => {
    // TODO: Implement these functions in the UI
  };

  const renderListenStep = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-xl font-medium mb-6">AI Audio Summary</h2>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-blue-500 hover:text-blue-600 transform transition-transform hover:scale-110"
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
            <h3 className="font-medium mb-2">Book & Author Background</h3>
            <p className="text-gray-600">{selectedBook.summary.background}</p>
          </section>
          
          <section>
            <h3 className="font-medium mb-2">Content Framework</h3>
            <p className="text-gray-600">{selectedBook.summary.structure}</p>
          </section>
          
          <section>
            <h3 className="font-medium mb-2">Key Points</h3>
            <ul className="list-disc pl-5 text-gray-600">
              {selectedBook.summary.keyPoints.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </section>
        </div>
        
        <button
          onClick={() => setCurrentStep('talk')}
          className="mt-6 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Start Deep Reading Discussion
        </button>
      </div>
    </div>
  );

  const renderTalkStep = () => (
    <div className="bg-white rounded-lg shadow-sm min-h-[600px] flex">
      <div className="w-72 border-r p-4">
        <h3 className="font-medium mb-4">Chapters & Concepts</h3>
        {selectedBook.chapters.map((chapter, idx) => (
          <div key={idx} className="mb-4">
            <h4 className="font-medium text-sm mb-2">{chapter.title}</h4>
            <ul className="space-y-2">
              {chapter.concepts.map((concept, conceptIdx) => (
                <li 
                  key={conceptIdx}
                  className="text-sm text-gray-600 hover:text-blue-500 cursor-pointer"
                >
                  {concept}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-b p-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'chat' ? 'bg-blue-50 text-blue-500' : 'text-gray-600'
              }`}
            >
              Chat
            </button>
            <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'notes' ? 'bg-blue-50 text-blue-500' : 'text-gray-600'
            }`}
          >
            Notes
          </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'chat' ? (
            <div className="space-y-4">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white ml-auto' 
                      : 'bg-gray-100'
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Mind map visualization would go here
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 p-2 border rounded-lg"
            />
            <button 
              onClick={() => {
                if (inputValue.trim()) {
                  setMessages(prev => [...prev, { type: 'user', content: inputValue }]);
                  setInputValue('');
                }
              }}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReflectStep = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-medium mb-4">Reflection & Summary</h2>
        
        <div className="space-y-4">
          <section>
            <h3 className="font-medium mb-2">Your Notes</h3>
            <textarea
              value={reflectionNotes}
              onChange={(e) => setReflectionNotes(e.target.value)}
              placeholder="Write your thoughts and reflections..."
              className="w-full h-32 p-3 border rounded-lg"
            />
          </section>

          <section>
            <h3 className="font-medium mb-2">Key Takeaways</h3>
            <div className="space-y-2">
              {selectedBook.summary.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <p className="text-gray-600">{point}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-medium mb-2">Recommended Next Reads</h3>
            <div className="grid grid-cols-2 gap-4">
              {featuredBooks.slice(0, 2).map(book => (
                <div key={book.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{book.title}</h4>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const steps = [
    { id: 'aim', label: 'Set Goal' },
    { id: 'listen', label: 'Listen' },
    { id: 'talk', label: 'Discuss' },
    { id: 'reflect', label: 'Reflect' }
  ];

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
                    onClick={() => {
                      setSelectedBook(book);
                      setMessages([
                        {
                          type: 'assistant',
                          content: `Let's explore ${book.title} by ${book.author}. What's your goal for reading this book?`,
                          options: [
                            'Understand the main themes and concepts',
                            'Apply insights to my life/work',
                            'Analyze the writing style',
                            'Custom goal (type below)'
                          ]
                        }
                      ]);
                    }}
                    className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
  
          <div className="flex-1 bg-white rounded-lg shadow-sm">
            <div className="border-b p-4">
              <div className="flex justify-between items-center">
                <h2 className="font-medium">Discussion</h2>
                {selectedBook && (
                  <div className="flex items-center gap-4">
                    {steps.map((step, idx) => (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(step.id)}
                        className={`text-sm ${
                          currentStep === step.id 
                            ? 'text-blue-500 font-medium' 
                            : 'text-gray-500'
                        }`}
                      >
                        {step.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
  
            <div className="flex-1 min-h-[600px] flex">
              {selectedBook && currentStep === 'talk' && (
                <div className="w-72 border-r p-4">
                  <h3 className="font-medium mb-4">Chapters & Concepts</h3>
                  {selectedBook.chapters.map((chapter, idx) => (
                    <div key={idx} className="mb-4">
                      <h4 className="font-medium text-sm mb-2">{chapter.title}</h4>
                      <ul className="space-y-2">
                        {chapter.concepts.map((concept, conceptIdx) => (
                          <li 
                            key={conceptIdx}
                            className="text-sm text-gray-600 hover:text-blue-500 cursor-pointer"
                          >
                            {concept}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
  
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-blue-500 text-white ml-auto max-w-[80%]' 
                            : 'bg-gray-100 max-w-[80%]'
                        }`}
                      >
                        <p className="mb-3">{message.content}</p>
                        {message.options && (
                          <div className="space-y-2 mt-4">
                            {message.options.map((option, optIdx) => (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  setMessages(prev => [...prev, 
                                    { type: 'user', content: option },
                                    { 
                                      type: 'assistant', 
                                      content: `Great choice! Let's begin exploring ${selectedBook.title} with that goal in mind.`,
                                      learningAids: [
                                        {
                                          type: 'background',
                                          title: 'Book Overview',
                                          content: selectedBook.summary.background
                                        }
                                      ]
                                    }
                                  ]);
                                }}
                                className="w-full p-2 text-left rounded border bg-white hover:bg-gray-50 text-gray-700"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                        {message.learningAids && (
                          <div className="mt-4 space-y-3">
                            {message.learningAids.map((aid, aidIdx) => (
                              <div key={aidIdx} className="bg-white p-3 rounded border">
                                <h4 className="font-medium mb-2">{aid.title}</h4>
                                <p className="text-gray-600">{aid.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
  
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={selectedBook ? "Ask a question..." : "Select a book to start the discussion..."}
                      disabled={!selectedBook}
                      className="flex-1 p-2 border rounded-lg"
                    />
                    <button 
                      onClick={() => {
                        if (inputValue.trim()) {
                          setMessages(prev => [...prev, { type: 'user', content: inputValue }]);
                          setInputValue('');
                        }
                      }}
                      disabled={!selectedBook}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BookLearningApp;