import React, { useState } from 'react';
import { Book, Search, Upload, ChevronRight, Send } from 'lucide-react';
import { LearningAidCard } from './LearningAids';

const BookLearningApp = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
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
      title: "To Kill a Mockingbird", 
      author: "Harper Lee",
      topics: ["Justice", "Growing Up", "Prejudice"]
    },
    { 
      id: 3, 
      title: "The Great Gatsby", 
      author: "F. Scott Fitzgerald",
      topics: ["American Dream", "Love & Wealth", "Social Class"]
    }
  ];

  const getAIResponse = (question, bookTitle = selectedBook?.title) => {
    // Initial book overview
    if (question.includes("What's it about?") && bookTitle === "1984") {
      return {
        content: "1984 is a powerful dystopian novel that explores the dangers of totalitarianism. The story follows Winston Smith, a low-ranking party member who begins to question the oppressive rule of Big Brother and the Party.",
        learningAids: [
          {
            type: 'background',
            title: 'Background',
            content: "Written in 1949, Orwell's novel was influenced by his experiences with totalitarian regimes and his concerns about the future of democracy."
          }
        ],
        prefills: [
          "Tell me about Winston Smith",
          "What are the main themes?",
          "How does the story end?"
        ]
      };
    }

    // Language and control discussion
    if (question.includes("language") && bookTitle === "1984") {
      return {
        content: "The Party's control of language through Newspeak is central to 1984. By limiting and manipulating language, they aim to make certain thoughts impossible to express and therefore impossible to think.",
        learningAids: [
          {
            type: 'test',
            title: 'Test your knowledge',
            content: "What is the main purpose of Newspeak?",
            options: [
              "To make language more efficient",
              "To make thoughtcrime impossible",
              "To improve communication"
            ],
            answer: "The correct answer is: To make thoughtcrime impossible. By eliminating words that could express rebellious thoughts, the Party aims to make dissent literally unthinkable."
          }
        ],
        prefills: [
          "What are some examples of Newspeak?",
          "How does Winston resist language control?",
          "Compare Newspeak to modern language changes"
        ]
      };
    }

    // Theme discussion
    if (question.includes("theme") && bookTitle === "1984") {
      return {
        content: "The major themes of 1984 include totalitarianism, surveillance, psychological manipulation, and the importance of truth and history.",
        learningAids: [
          {
            type: 'intertextuality',
            title: 'Related Books',
            content: "If you're interested in these themes, consider reading: Brave New World by Aldous Huxley, Fahrenheit 451 by Ray Bradbury, or We by Yevgeny Zamyatin."
          }
        ],
        prefills: [
          "How does surveillance affect society?",
          "What role does memory play?",
          "Why is truth important in the novel?"
        ]
      };
    }

    // Default response
    return {
      content: "Let's explore that aspect of the book. What specifically would you like to know?",
      learningAids: [
        {
          type: 'think',
          title: 'Stop and think',
          content: "Consider how this element contributes to the themes of control and resistance in the novel."
        }
      ],
      prefills: [
        "Tell me about the characters",
        "Explain the symbolism",
        "How does this connect to themes?"
      ]
    };
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    const topicQuestion = `Tell me about ${topic} in ${selectedBook.title}`;
    handleQuestionClick(topicQuestion);
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setMessages([
      {
        type: 'user',
        content: `I want to learn more about ${book.title}. What's it about?`
      },
      { 
        type: 'assistant', 
        content: book.initialResponse?.content,
        learningAids: book.initialResponse?.learningAids,
        prefills: book.initialResponse?.prefills
      }
    ]);
  };

  const handleQuestionClick = (question) => {
    const aiResponse = getAIResponse(question);
    setMessages([
      ...messages,
      { type: 'user', content: question },
      { 
        type: 'assistant', 
        content: aiResponse.content,
        learningAids: aiResponse.learningAids,
        prefills: aiResponse.prefills
      }
    ]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    handleQuestionClick(inputValue);
    setInputValue('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Literary Explorer</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {!selectedBook ? (
          <div>
            <h2 className="text-xl font-medium mb-6">Featured Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBooks.map(book => (
                <div 
                  key={book.id}
                  onClick={() => handleBookSelect(book)}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <Book className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="font-medium">{book.title}</h3>
                  <p className="text-gray-600 mb-3">{book.author}</p>
                  <div className="flex flex-wrap gap-2">
                    {book.topics.map(topic => (
                      <span key={topic} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-medium mb-4">What would you like to read today?</h2>
              <div className="flex gap-4">
                <input 
                  type="text"
                  placeholder="Enter a book title or ask a question..."
                  className="flex-1 p-3 border rounded-lg"
                />
                <button className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-3 border rounded-lg hover:bg-gray-50">
                  <Upload className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-6">
            <div className="w-64 bg-white p-4 rounded-lg shadow-sm">
              <div className="mb-4">
                <button 
                  onClick={() => {
                    setSelectedBook(null);
                    setSelectedTopic(null);
                    setMessages([]);
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  ← Back to books
                </button>
              </div>
              <h3 className="font-medium mb-4">Explore Topics</h3>
              <ul className="space-y-2">
                {selectedBook.topics.map((topic) => (
                  <li 
                    key={topic}
                    onClick={() => handleTopicClick(topic)}
                    className={`flex items-center text-blue-500 hover:text-blue-600 cursor-pointer ${
                      selectedTopic === topic ? 'font-medium' : ''
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col h-[80vh]">
              <div className="p-4 border-b">
                <h2 className="font-medium">{selectedBook.title} Discussion</h2>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`${
                      message.type === 'user' 
                        ? 'ml-auto bg-blue-500 text-white' 
                        : 'bg-gray-100'
                    } p-4 rounded-lg max-w-[80%]`}
                  >
                    <p>{message.content}</p>
                    {message.learningAids && (
                      <div className="mt-4 space-y-3">
                        {message.learningAids.map((aid, i) => (
                          <LearningAidCard 
                            key={i}
                            type={aid.type}
                            title={aid.title}
                            options={aid.options}
                            answer={aid.answer}
                          >
                            {aid.content}
                          </LearningAidCard>
                        ))}
                      </div>
                    )}
                    {message.prefills && message.type === 'assistant' && (
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
                ))}
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask a question..."
                    className="flex-1 p-2 border rounded-lg"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookLearningApp;