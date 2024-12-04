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

const LEARNING_AIDS_PROMPT = `
Available learning aid types and their purposes:
- think: Reflection questions or critical thinking prompts
- why: Explanations of significance or relevance
- background: Historical or contextual information
- test: Multiple choice or open-ended questions
- intertextuality: Connections to other works
- explore: Related resources or concepts
- guide: Step-by-step analysis or reading guide

Each learning aid should be targeted and relevant to the current discussion point.
`;

const generateBookResponse = async (book, question) => {
  try {
    const response = await api.post('/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a knowledgeable literary assistant helping users understand books. Respond with a JSON object containing a main response, learning aids, and follow-up questions. Do not include markdown formatting or code blocks in your response. Return only the JSON object.'
        },
        {
          role: 'user',
          content: `Book: ${book.title}
          Question: ${question}
          
          Response format:
          {
            "content": "main response text",
            "learningAids": [{
              "type": "think|why|background|test",
              "title": "aid title",
              "content": "aid content",
              "options": ["option1", "option2"],
              "answer": "correct answer"
            }],
            "prefills": ["follow-up question 1", "follow-up question 2"]
          }`
        }
      ]
    });

    const aiResponse = response.data.choices[0].message.content;
    console.log('Raw AI Response:', aiResponse); // Add this line
    return extractJSONFromResponse(aiResponse);
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
};

const generateInitialBookOverview = async (book) => {
  try {
    const response = await api.post('/chat/completions', {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Generate an engaging overview of the book as a JSON object.
          ${LEARNING_AIDS_PROMPT}
          Include 2-3 relevant learning aids that will help readers start exploring the book.
          Identify 3-4 major topics or themes for discussion.
          Do not include markdown formatting in your response. Return only the JSON object.`
        },
        {
          role: 'user',
          content: `Generate an overview for: ${book.title} by ${book.author}
          
          Response format:
          {
            "content": "brief but engaging overview",
            "topics": ["topic1", "topic2", "topic3"],
            "learningAids": [{
              "type": "why|background|explore",
              "title": "aid title",
              "content": "aid content"
            }],
            "prefills": ["suggested question 1", "suggested question 2"]
          }`
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