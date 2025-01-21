import Image from 'next/image';
import { Boost } from '../../types/boost.interface';
import HeartImage from '../../assets/images/boosts/heart.png';
import TimeImage from '../../assets/images/boosts/time.png';
import RocketImage from '../../assets/images/boosts/rocket.png';
import MagnetImage from '../../assets/images/boosts/magnet.png';
import ShieldImage from '../../assets/images/boosts/shield.png';

export const UserBoost = ({ boost }: { boost: Boost }) => {
  const getBoostImage = () => {
    switch (boost.id) {
      case 0:
        return HeartImage;
      case 1:
        return TimeImage;
      case 2:
        return RocketImage;
      case 3:
        return ShieldImage;
      case 4:
        return MagnetImage;
      default:
        return HeartImage; // Default icon
    }
  };

  return (
    <button className="flex items-center gap-1 rounded-xl border-2 border-[#4D6670] px-3 py-2">
      <Image src={getBoostImage()} alt={boost.name} className="w-5 h-5" />
      <p className="text-[15px]">{boost.amount}</p>
    </button>
  );
};
