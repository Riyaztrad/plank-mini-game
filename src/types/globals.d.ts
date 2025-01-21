// import type { TelegramWebApps } from 'telegram-webapps-types';

declare global {
  interface Window {
    Telegram: any; //TelegramWebApps.SDK;
  }

  namespace NodeJS {
    interface ProcessEnv {
      /** Authorization token for the bot. This is used to validate the hash's authenticity. */
      BOT_TOKEN: string;
    }
  }
}

export {};
