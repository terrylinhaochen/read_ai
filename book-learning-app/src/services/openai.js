import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

const extractJSONFromResponse = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error('Failed to parse extracted JSON:', e);
      }
    }
    
    return {
      content: text,
      learningAids: [{
        type: 'think',
        title: 'Note',
        content: 'Failed to parse AI response properly. Please try again.'
      }],
      prefills: []
    };
  }
};

const RESPONSE_FORMAT = `For every response, provide:
1. A concise main answer (2-3 sentences)
2. At least three of these learning aids:
   - A test question with multiple choice options
   - A key vocabulary term or concept definition
   - A thought-provoking discussion prompt
   - Historical or contextual background
   - Connections to other works or modern relevance
   - Common misconceptions and corrections
3. Three relevant follow-up questions

Format as JSON:
{
  "content": "concise main answer",
  "learningAids": [
    {
      "type": "test",
      "title": "Test Your Understanding",
      "content": "question text",
      "options": ["option1", "option2", "option3"],
      "answer": "explanation of correct answer"
    },
    {
      "type": "vocab",
      "title": "Key Term",
      "term": "term or concept",
      "definition": "clear definition"
    },
    {
      "type": "think",
      "title": "Stop and Think",
      "content": "thought prompt",
      "hint": "thinking guidance"
    },
    {
      "type": "background",
      "title": "Historical Context",
      "content": "relevant background"
    },
    {
      "type": "connection",
      "title": "Related Works",
      "content": "connections to other works or modern day"
    },
    {
      "type": "misconception",
      "title": "Common Misconception",
      "incorrect": "wrong idea",
      "correct": "right idea",
      "explanation": "detailed explanation"
    }
  ],
  "prefills": ["follow-up question 1", "follow-up question 2", "follow-up question 3"]
}`;

const generateBookResponse = async (book, question) => {
  try {
    const response = await api.post('/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a knowledgeable literary assistant helping users understand ${book.title}. 
          ${RESPONSE_FORMAT}
          Keep main answers concise but ensure learning aids are comprehensive and engaging.
          Do not include markdown formatting. Return only pure JSON.`
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7
    });

    const aiResponse = response.data.choices[0].message.content;
    console.log('Raw AI Response:', aiResponse);
    return extractJSONFromResponse(aiResponse);
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
};

const generateInitialBookOverview = async (book) => {
  try {
    const response = await api.post('/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Generate an initial overview of ${book.title} by ${book.author}.
          ${RESPONSE_FORMAT}
          Additionally include:
          - A list of major topics/themes for the book
          - Background on the author and historical context
          - The book's significance and relevance today
          
          Return as JSON with an additional "topics" array for the major themes.`
        },
        {
          role: 'user',
          content: `Provide an engaging overview of ${book.title}`
        }
      ],
      temperature: 0.7
    });

    const aiResponse = response.data.choices[0].message.content;
    return extractJSONFromResponse(aiResponse);
  } catch (error) {
    console.error('Error generating book overview:', error);
    throw error;
  }
};

export { generateBookResponse, generateInitialBookOverview };