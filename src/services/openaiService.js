const axios = require('axios');

const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

const generateContent = async (type, subject) => {
  const prompt = type === 'event'
    ? `Create an agenda for ${subject}`
    : `Write an email body for ${subject}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',  // cheaper model
    messages: [{ 
      role: 'user', 
      content: prompt }],
  });

  return response.choices[0].message.content.trim();
};



const generateSearchSummary = async (query, activities) => {
  try {
   

    const prompt = `You are a helpful assistant tasked with summarizing the results of a search query. Based on the activities listed below, please generate a concise yet informative summary that highlights the key insights and details that are relevant to the search query. The summary should be well-structured and easy to read.

Search Query: "${query}"

Activities:
${activities.join('\n')}

Summary (Use bullet points or short paragraphs, providing clear insights):
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  // cheaper model
      messages: [{ 
        role: 'user', 
        content: prompt
      }],
    });

    return response.choices[0].message.content.trim();

  } catch (error) {
    console.error('Error generating summary with OpenAI:', error);
    throw new Error('Failed to generate AI summary');
  }
};


module.exports = { generateContent,generateSearchSummary };
