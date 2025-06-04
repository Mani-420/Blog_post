import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/generate-content', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'gpt-3.5-turbo-instruct',
        prompt,
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );
    res.json({ content: response.data.choices[0].text });
  } catch (error) {
    console.error(error.response?.data || error.message || error);
    res.status(500).json({ error: 'AI generation failed' });
  }
});

export default router;
