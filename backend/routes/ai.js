const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authMiddleware = require('../middleware/authMiddleware');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

router.use(authMiddleware);

async function generateContent(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw new Error('AI service unavailable');
  }
}

router.post('/summarize', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.length < 50) {
      return res.status(400).json({ message: 'Content too short to summarize (min 50 characters)' });
    }

    const prompt = `You are a helpful assistant that summarizes text concisely. Provide a clear, short summary in bullet points or a brief paragraph.\n\nSummarize the following text:\n\n${content}`;
    
    const summary = await generateContent(prompt);
    res.json({ summary });
  } catch (error) {
    console.error('Summarize error:', error.message);
    res.status(500).json({ message: 'Error generating summary' });
  }
});

router.post('/smart-tag', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title && !content) {
      return res.status(400).json({ message: 'Title or content required' });
    }

    const text = `${title || ''} ${content || ''}`.trim();
    const prompt = `Suggest 2-4 relevant tags/categories for the following text. Return only comma-separated tags, nothing else.\n\nText: ${text}`;
    
    const result = await generateContent(prompt);
    const tags = result
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .slice(0, 4);

    res.json({ tags });
  } catch (error) {
    console.error('Smart tag error:', error.message);
    res.status(500).json({ message: 'Error generating tags' });
  }
});

router.post('/rewrite', async (req, res) => {
  try {
    const { content, style } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Content required' });
    }

    const styles = {
      'simplify': 'Simplify this text to make it easier to understand',
      'expand': 'Expand this text with more detail and explanation',
      'formal': 'Rewrite this in a more formal, professional tone',
      'casual': 'Rewrite this in a more casual, friendly tone',
      'bullet': 'Convert this text into clear bullet points'
    };

    const instruction = styles[style] || 'Improve this text';
    const prompt = `${instruction}:\n\n${content}`;
    
    const rewritten = await generateContent(prompt);
    res.json({ rewritten });
  } catch (error) {
    console.error('Rewrite error:', error.message);
    res.status(500).json({ message: 'Error rewriting text' });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { question, notes } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: 'Question required' });
    }

    const notesContext = notes && notes.length > 0 
      ? notes.map(n => `Note: ${n.title}\n${n.content}`).join('\n\n')
      : 'No notes available';

    const prompt = `You are a helpful assistant that answers questions based on the user's notes. Be concise and relevant. If the answer is not in the notes, say so.\n\nHere are my notes:\n\n${notesContext}\n\nQuestion: ${question}`;
    
    const answer = await generateContent(prompt);
    res.json({ answer });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ message: 'Error answering question' });
  }
});

router.post('/generate', async (req, res) => {
  try {
    const { type, content } = req.body;
    
    if (!content || !type) {
      return res.status(400).json({ message: 'Content and type required' });
    }

    let prompt = '';
    switch (type) {
      case 'blog':
        prompt = `Write a complete, engaging blog post based on the following notes. Use a friendly but informative tone, include an introduction, body paragraphs, and conclusion. Format it well.\n\nNotes:\n${content}`;
        break;
      case 'tweet':
        prompt = `Create an engaging Twitter/X thread (3-5 tweets) based on the following notes. Make it punchy, use hashtags, and end with a call to action.\n\nNotes:\n${content}`;
        break;
      case 'linkedin':
        prompt = `Write a professional LinkedIn post based on the following notes. Use LinkedIn's professional tone, include a hook, story/insight, and call to action.\n\nNotes:\n${content}`;
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type' });
    }

    const result = await generateContent(prompt);
    res.json({ result });
  } catch (error) {
    console.error('Generate error:', error.message);
    res.status(500).json({ message: 'Error generating content' });
  }
});

module.exports = router;