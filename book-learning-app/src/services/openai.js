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
    // If it's already valid JSON, return it
    return JSON.parse(text);
  } catch (e) {
    // Try to extract JSON from markdown code block
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error('Failed to parse extracted JSON:', e);
      }
    }
    
    // Fallback response if parsing fails
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
          content: 'Generate a book overview as a JSON object. Do not include markdown formatting or code blocks in your response. Return only the JSON object.'
        },
        {
          role: 'user',
          content: `Generate an overview for: ${book.title} by ${book.author}
          
          Response format:
          {
            "content": "brief overview",
            "topics": ["topic1", "topic2", "topic3"],
            "learningAids": [{
              "type": "why|background",
              "title": "aid title",
              "content": "aid content"
            }],
            "prefills": ["suggested question 1", "suggested question 2"]
          }`
        }
      ]
    });

    const aiResponse = response.data.choices[0].message.content;
    return extractJSONFromResponse(aiResponse);
  } catch (error) {
    console.error('Error generating book overview:', error);
    throw error;
  }
};

export { generateBookResponse, generateInitialBookOverview };