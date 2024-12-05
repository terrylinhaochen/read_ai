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
1. A clear, concise main answer (2-3 sentences)
2. Only include learning aids that have meaningful content:
   - A thought-provoking discussion prompt
   - Historical or contextual background
   - A key concept explanation
   - A connection to modern relevance
3. Three follow-up questions

Format as JSON:
{
  "content": "main answer here",
  "learningAids": [
    {
      "type": "think",
      "title": "Stop and Think",
      "content": "thought-provoking question or prompt"
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
          Keep responses focused and engaging. Avoid technical jargon unless specifically asked.
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
          Focus on capturing reader interest and highlighting key aspects.
          Include one "why it matters" aid and one "think about" prompt.
          Return as JSON with the same format as other responses.`
        },
        {
          role: 'user',
          content: `What makes ${book.title} worth reading?`
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