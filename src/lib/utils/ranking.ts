import prisma from '../prisma';

export const getLeaguePointsRanking = async (
  points: number,
  upperRank: number,
  lowerRank: number
) => {
  const count = await prisma.user.count({
    where: {
      AND: [
        { points: { gte: points } },
        {
          max_score: {
            lte: (
              await prisma.user.findFirst({
                skip: upperRank - 1,
                orderBy: { max_score: 'desc' },
                select: { max_score: true },
              })
            )?.max_score,
          },
        },
        {
          max_score: {
            gt:
              (
                await prisma.user.findFirst({
                  skip: lowerRank - 1,
                  orderBy: { max_score: 'desc' },
                  select: { max_score: true },
                })
              )?.max_score || 0,
          },
        },
      ],
    },
  });
  return Math.max(1, count); // Ensure minimum rank is 1
};

export const getLeagueScoreRanking = async (
  maxScore: number,
  upperRank: number,
  lowerRank: number
) => {
  const count = await prisma.user.count({
    where: {
      AND: [
        { max_score: { gte: maxScore } },
        {
          max_score: {
            lte: (
              await prisma.user.findFirst({
                skip: upperRank - 1,
                orderBy: { max_score: 'desc' },
                select: { max_score: true },
              })
            )?.max_score,
          },
        },
        {
          max_score: {
            gt:
              (
                await prisma.user.findFirst({
                  skip: lowerRank - 1,
                  orderBy: { max_score: 'desc' },
                  select: { max_score: true },
                })
              )?.max_score || 0,
          },
        },
      ],
    },
  });
  return Math.max(1, count); // Ensure minimum rank is 1
};
