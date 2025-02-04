import IconHeartRed from '../../assets/images/boosts/heart.png';
import IconLightClockBlue from '../../assets/images/boosts/time.png';
import IconRocketGreen from '../../assets/images/boosts/rocket.png';
import IconShield from '../../assets/images/boosts/shield.png';
import IconMagnet from '../../assets/images/boosts/magnet.png';
import Image from 'next/image';

export const TaskBoost = ({
  boostId,
  amount,
  name,
}: {
  boostId: number;
  amount: number;
  name: string;
}) => {
  const renderIcon = () => {
    switch (boostId) {
      case 0:
        return IconHeartRed;
      case 1:
        return IconRocketGreen;
      case 2:
        return IconLightClockBlue;
      case 3:
        return IconShield;
      case 4:
        return IconMagnet;
      default:
        return IconHeartRed; // Default icon
    }
  };

  return (
    <div className="flex items-center gap-1 text-[12px]">
      <Image src={renderIcon()} alt="coin" width={120} height={120} className="w-5 h-auto" />
      <p className="text-[#02a3b5] font-gumdrop">
        +{amount} {name}
      </p>
    </div>
  );
};
