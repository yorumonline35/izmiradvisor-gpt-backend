import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Configuration, OpenAIApi } from 'openai';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  const context = `
  İzmirAdvisor, İzmir ve Kuzey Kıbrıs'ta yatırım ve yaşam odaklı gayrimenkul danışmanlığı sunar. 
  Yabancı yatırımcılara oturum izni, sağlık, eğitim gibi konularda destek verir. 
  Öğrencilere, yabancılara ve yatırımcılara özel kiralık ev seçenekleri sağlar.
  `;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `Aşağıdaki bilgileri temel alarak kullanıcının sorusuna Türkçe veya İngilizce cevap ver. Bilgi: ${context}` },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 400,
      temperature: 0.7
    });

    const botResponse = completion.data.choices[0].message.content;
    res.json({ reply: botResponse });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'ChatGPT cevabı alınamadı.' });
  }
});

app.listen(port, () => {
  console.log(`Chatbot sunucusu çalışıyor: http://localhost:${port}`);
});
