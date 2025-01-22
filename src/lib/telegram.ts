export const sendNotification = async (chatId: string, text: string) => {
  if (!process.env.BOT_TOKEN) {
    throw new Error('BOT_TOKEN is not set');
  }
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🎮 Play Now',
                  url: process.env.NEXT_PUBLIC_BOT_URL,
                },
              ],
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to send notification:', error);
    throw error;
  }
};
