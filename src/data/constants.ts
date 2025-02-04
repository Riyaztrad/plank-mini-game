import IconFrens from '../assets/icons/icon-frens';
import IconHome from '../assets/icons/icon-home';
import IconLeaderboard from '../assets/icons/icon-leaderboard';
import IconStore from '../assets/icons/icon-store';
import IconTasks from '../assets/icons/icon-tasks';

// Referrals
export const DIRECT_REFERRER_POINTS_REWARD = 200;
export const DIRECT_REFERRER_COINS_REWARD = 1;

export const DIRECT_REFERRED_POINTS_REWARD = 20;
export const DIRECT_REFERRED_COINS_REWARD = 1;

export const INDIRECT_REFERRER_POINTS_REWARD = 20; // Parent referral

// Connect wallet task
export const CONNECT_WALLET_POINTS_REWARD = 250;
export const DAILY_CHECKIN_PLAYS_REWARD = 1;
export const FIVE_DAY_TIME_REWARD = 1;
export const MAX_GAME_SCORE = 15000;

export const Links = [
  {
    label: 'Home',
    href: '/home',
    icon: IconHome,
  },
  {
    label: 'Rank',
    href: '/leaderboard',
    icon: IconLeaderboard,
  },
  {
    label: 'Store',
    href: '/store',
    icon: IconStore,
  },
  {
    label: 'Earn',
    href: '/tasks',
    icon: IconTasks,
  },
  {
    label: 'Frens',
    href: '/frens',
    icon: IconFrens,
  },
];

export const AppColors = [
  '#00EDFF',
  '#FF4F6A',
  '#286EF0',
  '#8028F0',
  '#61E694',
  '#EB8F67',
  '#28F0F0',
  '#C828F0',
];

export const NOTIFICATIONS_MESSAGES = {
  DAILY_CHECK_IN_EXPIRES:
    "⏰ Hurry! Your daily check-in is about to expire—don't lose your streak! Log in now!",
  INACTIVITY_WARNING:
    "⚠️❗ You're slipping down the leagues in EstateX Moonshot! Jump back in now to earn more $ESX Tokens!💰🚀",
  LIVES_RESET:
    '🔋 Your lives are refreshed! Blast back into EstateX Moonshot and rocket to the higher league now! 🚀',
  REFERRAL_BONUS:
    "🎁 Your friend joined! You've earned rewards ⭐️ refer more friends for extra points and lives!",
};

const isTestnet = process.env.NEXT_PUBLIC_APP_MODE === 'testnet';

// export const BoostPurchases = new Map<number, ShopBoost>([
//   [0, { price: 4, amount: 5, requiredLeague: 7 }],
//   [1, { price: 4, amount: 5, requiredLeague: 7 }],
//   [3, { price: 6, amount: 5, requiredLeague: 4 }], //unlocks in Mars league
//   [4, { price: 6, amount: 5, requiredLeague: 3 }], //unlocks in Jupiter league
// ]);

// export const ShopBoosts: ShopItem[] = [
//   {
//     id: 0,
//     text: 'Extra lives',
//     description: 'Rack up these boosts and get 5 extra daily plays.',
//     price: 5,
//     amount: 5,
//     requiredLeague: 7,
//   },
//   {
//     id: 1,
//     text: '5 sec bonus',
//     description: 'Adds an extra 5 seconds to your gameplay when activated.',
//     price: 10,
//     amount: 5,
//     requiredLeague: 7,
//   },
//   {
//     id: 2,
//     text: 'speed boost',
//     description: 'Boosts the rockets speed to cover more distance.',
//     price: 10,
//     amount: 5,
//     requiredLeague: 4,
//   }, //unlocks in Mars league
//   {
//     id: 3,
//     text: 'asteroid shield',
//     description: 'Repels all asteroids automatically. Use once per game',
//     price: 20,
//     amount: 5,
//     requiredLeague: 3,
//   }, //unlocks in Jupiter league
//   {
//     id: 4,
//     text: 'boost magnet',
//     description: 'Collects all passing coins automatically when in boost!',
//     price: 20,
//     amount: 5,
//     requiredLeague: 3,
//   }, //unlocks in Jupiter league
//   {
//     id: 5,
//     text: 'loot box',
//     description:
//       "Soon you'll be able to get Loot Boxes which will give you a chance to win insane real world prizes!",
//     price: 50,
//     amount: 1,
//     requiredLeague: 3,
//   }, //unlocks in Jupiter league
//   { id: 6, text: 'starter pack', description: '', price: 6, amount: 75, requiredLeague: 3 }, //unlocks in Jupiter league
// ];

export const allowedOrigins = [
  'http://localhost:3000',
  'https://moonshot.estatex.eu',
  'https://estatex-telegram.vercel.app',
  'https://estatex-telegram-git-v2-devstudios.vercel.app',
  'https://estatex-telegram-git-dev-devstudios.vercel.app',
];
export const RATE_LIMIT_PER_SECOND = 30;
export const SLEEP_TIME = 1000 / RATE_LIMIT_PER_SECOND;
export const MAX_USERS_PER_BATCH = 450;

export const INACTIVITY_DAYS = 7;
export const EXPIRE_MAX_HOURS = 48;

export const ALLOWED_GAME_TIMESTAMP_DIFF = 600;