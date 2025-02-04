import prisma from '../prisma';

interface UserWithLeague {
  userId: string;
  maxScore: number;
  rank: number;
  percentile: number;
  league: {
    id: number;
    title: string;
    percentile: number;
  } | null;
}

export const getUsersWithLeagues = async (): Promise<UserWithLeague[]> => {
  // Get total number of users for percentile calculation
  const totalUsers = await prisma.user.count();

  // Get all leagues ordered by percentile
  const leagues = await prisma.league.findMany({
    orderBy: {
      percentile: 'desc',
    },
  });

  // Get all users with their rank based on max_score
  const usersWithRank = await prisma.$queryRaw<
    Array<{
      telegram_id: string;
      rank: number;
      max_score: number;
    }>
  >`
    SELECT 
      telegram_id,
      max_score,
      RANK() OVER (ORDER BY max_score DESC) as rank
    FROM "User"
  `;

  // Map users to their leagues based on percentile
  const usersWithLeagues = usersWithRank.map((user) => {
    const userPercentile = (user.rank - 1) / totalUsers;
    const league = leagues.find((league) => userPercentile <= league.percentile);

    return {
      userId: user.telegram_id,
      maxScore: user.max_score,
      rank: user.rank,
      percentile: userPercentile,
      league: league
        ? {
            id: league.id,
            title: league.title,
            percentile: league.percentile,
          }
        : null,
    };
  });

  return usersWithLeagues;
};
