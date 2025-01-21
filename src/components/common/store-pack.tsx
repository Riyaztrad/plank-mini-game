import Image from 'next/image';
import StarImage from '../../assets/images/star.png';
import BoostsImage from '../../assets/images/boosts.svg';
import { ShopItem } from '../../types/boost.interface';
import clsx from 'clsx';

export const StorePack = ({
  item,
  blocked,
  onClick,
}: {
  item: ShopItem;
  blocked: boolean;
  onClick: () => void;
}) => {
  const handleClick = () => {
    if (blocked) return;
    else onClick();
  };

  return (
    <div
      className={clsx(
        'relative w-full h-[170px] rounded-[12px] overflow-hidden bg-[#063341] border-2 border-[#4D6670] font-gumdrop',
        blocked && 'opacity-50'
      )}
      onClick={handleClick}>
      <div className="flex items-center justify-center gap-4 py-3">
        <Image
          src={`/shop/${item.id}.svg`}
          alt="coin"
          width={400}
          height={400}
          className="w-32 h-auto"
        />

        <div className="text-center space-y-1">
          <span className="text-white text-[20px] leading-none">{item.amount} item</span>
          <h2 className="text-[12px] text-[#00EDFF99]">{item.text}</h2>
          <Image src={BoostsImage} alt="boosts" width={120} height={120} className="w-24 h-auto" />
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-[40px] bg-[#4D6670] flex items-center px-6">
        <div className="flex items-center gap-3 w-full justify-center">
          <Image src={StarImage} alt="star" width={120} height={120} className="w-6 h-auto" />
          <span className="text-[14px] text-[#E9E9E999]">{item.price}</span>
        </div>
      </div>
    </div>
  );
};
