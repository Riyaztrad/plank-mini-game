import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const leagues = [
    {
      id: 0,
      title: 'Interstellar',
      description: 'Score: Top 10%',
      rewards_pool: 3000000,
      percentile: 0,
    },
    {
      id: 1,
      title: 'Neptune',
      description: 'Score: 11-20%',
      rewards_pool: 2000000,
      percentile: 0.1,
    },
    {
      id: 2,
      title: 'Uranus',
      description: 'Score: 21-30%',
      rewards_pool: 1000000,
      percentile: 0.2,
    },
    { id: 3, title: 'Saturn', description: 'Score: 31-40%', rewards_pool: 750000, percentile: 0.3 },
    {
      id: 4,
      title: 'Jupiter',
      description: 'Score: 41-50%',
      rewards_pool: 750000,
      percentile: 0.4,
    },
    { id: 5, title: 'Mars', description: 'Score: 51-60%', rewards_pool: 750000, percentile: 0.5 },
    { id: 6, title: 'Earth', description: 'Score: 61-70%', rewards_pool: 750000, percentile: 0.6 },
    { id: 7, title: 'Venus', description: 'Score: 71-80%', rewards_pool: 25000, percentile: 0.7 },
    { id: 8, title: 'Mercury', description: 'Score: 81-100%', rewards_pool: 0, percentile: 1 },
  ];

  await Promise.all(
    leagues.map((league) =>
      prisma.league.upsert({
        where: { id: league.id },
        update: league,
        create: league,
      })
    )
  );

  // Reset user stats
  await prisma.user.updateMany({
    data: {
      points: 0,
      max_score: 0,
      consecutive_days: 0,
    },
  });

  // Delete all referrals
  await prisma.referral.deleteMany({});
  await prisma.userLeague.deleteMany({});
  await prisma.userTask.deleteMany({});
}

main()
  .then(() => {
    console.log('Seeding finished.');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
