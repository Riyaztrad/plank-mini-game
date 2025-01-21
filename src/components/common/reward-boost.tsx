import Image from 'next/image';
import { Boost } from '../../types/boost.interface';
import HeartImage from '../../assets/images/boosts/heart.png';
import TimeImage from '../../assets/images/boosts/time.png';
import RocketImage from '../../assets/images/boosts/rocket.png';
import MagnetImage from '../../assets/images/boosts/magnet.png';
import ShieldImage from '../../assets/images/boosts/shield.png';

export const RewardBoost = ({ boost }: { boost: Boost }) => {
  const getBoostImage = () => {
    switch (boost.id) {
      case 0:
        return HeartImage;
      case 1:
        return RocketImage;
      case 2:
        return TimeImage;
      case 3:
        return ShieldImage;
      case 4:
        return MagnetImage;
      default:
        return HeartImage; // Default icon
    }
  };

  return (
    // <button className="flex items-center gap-1 rounded-xl border-2 border-[#4D6670] px-3 py-2">
    //   <Image src={getBoostImage()} alt={boost.name} className="w-5 h-5" />
    //   <p className="text-[15px]">{boost.amount}</p>
    // </button>
    <div className="flex flex-col items-center justify-center h-[155px] w-[110px] border-2 border-white rounded-xl bg-white/10 font-gumdrop shadow-[0px_4px_0px_0px_#FFFFFF] backdrop-blur-lg">
      <Image
        src={getBoostImage()}
        alt="boost"
        width={120}
        height={120}
        className="w-12 h-auto mb-3"
      />
      <p className="text-[20px]">{boost.amount}</p>
      <p className="text-[12px] text-[#0D4C60]">{boost.name}</p>
    </div>
  );
};
