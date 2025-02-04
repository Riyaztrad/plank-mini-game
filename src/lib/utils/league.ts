import { League, User } from '@prisma/client';
import prisma from '../prisma';

interface LeagueWithBoundaries {
  league: League | null;
  upperRank: number;
  lowerRank: number;
  hasZeroScore: boolean;
}

export async function getUserLeague(userId: string): Promise<LeagueWithBoundaries> {
  // Define leagues from highest (Interstellar) to lowest (Mercury)
  const leagues = await prisma.league.findMany({
    orderBy: {
      percentile: 'asc',
    },
  });

  const user = await prisma.user.findUnique({
    where: { telegram_id: userId },
    select: { max_score: true },
  });
  if (!user) {
    return { league: null, upperRank: 0, lowerRank: 0, hasZeroScore: false };
  }

  // Get total number of active users (score > 0)
  const totalActiveUsers = await prisma.user.count({
    where: {
      max_score: { gt: 0 },
    },
  });
  const totalUsers = await prisma.user.count({});

  // If user has 0 score, assign them to the lowest league (Mercury)
  if (user.max_score === 0) {
    return {
      league: leagues[leagues.length - 1], // Mercury is now last
      upperRank: totalActiveUsers + 1,
      lowerRank: totalUsers,
      hasZeroScore: true,
    };
  }

  // Get user's position among active users based on max_score (1 = highest)
  const userRank =
    (await prisma.user.count({
      where: {
        AND: [{ max_score: { gt: user.max_score } }, { max_score: { gt: 0 } }],
      },
    })) + 1;

  // Calculate user's percentile (0 = top, 1 = bottom)
  const userPercentile = userRank / totalActiveUsers;

  // Find the appropriate league based on percentile
  let userLeague = null;
  let leagueIndex = -1;

  // Loop through leagues from highest to lowest
  for (let i = 0; i < leagues.length; i++) {
    if (userPercentile <= leagues[i].percentile) {
      userLeague = leagues[i];
      leagueIndex = i;
      break;
    }
  }

  if (!userLeague) {
    // If no league found, user is in the lowest league (Mercury)
    userLeague = leagues[leagues.length - 1];
    leagueIndex = leagues.length - 1;
  }

  // Calculate rank boundaries for the league
  const upperPercentile = leagueIndex > 0 ? leagues[leagueIndex - 1]?.percentile || 0 : 0;
  const lowerPercentile = userLeague.percentile;

  const upperRank = Math.max(1, Math.floor(upperPercentile * totalActiveUsers) + 1);
  const lowerRank = Math.ceil(lowerPercentile * totalActiveUsers);

  return {
    league: userLeague,
    upperRank,
    lowerRank,
    hasZeroScore: user.max_score === 0,
  };
}
