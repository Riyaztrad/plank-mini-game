export const sendNotification = async (chatId: string, text: string) => {
  // if (!'7252746660:AAHLQwWDRyjMqF5tqAuvTXQL1Fb7GMqjBnY') {
  //   throw new Error('BOT_TOKEN is not set');
  // }
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${'7252746660:AAHLQwWDRyjMqF5tqAuvTXQL1Fb7GMqjBnY'}/sendMessage`,
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
                  url: 'https://t.me/plank_rocket_bot',
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
