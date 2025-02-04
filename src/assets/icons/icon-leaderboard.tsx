import Image from 'next/image';
import RankIcon from './Rank.png';

const IconLeaderboard = () => {
  return (
    <Image
      src={RankIcon}
      alt="Rank Icon"
      width={31}
      height={32}
    />
  );
};

export default IconLeaderboard;


