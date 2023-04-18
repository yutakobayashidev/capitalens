import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const chatmsg = req.body.chat as string;

  if (chatmsg.length <= 0) {
    res.status(500).json({ error: 'no chat message' });
    return;
  }

  if (!req.body.key) {
    res.status(500).json({ error: 'no api key' });
    return;
  }

  const configuration = new Configuration({
    apiKey: req.body.key,
  });

  const openai = new OpenAIApi(configuration);

  const call35Turbo = async (chat: string) => {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            '入力された国会の議事録を要約してください。\n制約条件\n・文章は簡潔にわかりやすく。\n・箇条書きで3行以内で出力。\n・1行あたりの文字数は80文字程度。\n・重要なキーワードは取り逃がさない。\n・要約した文章は日本語へ翻訳。',
        },
        { role: 'user', content: chat },
      ],
    });
    return completion.data!.choices[0]!.message!.content;
  };

  try {
    const chat = await call35Turbo(chatmsg);

    res.status(200).json({ chat: chat });
  } catch (error: any) {
    if (error.response) {
      res.status(200).json({ chat: error.response.data.error.message });
    } else {
      res.status(200).json({ chat: error.message });
    }
  }
}
