import Image from 'next/image';
import StarImage from '../../assets/images/star.png';
import { ShopItem } from '../../types/boost.interface';
import clsx from 'clsx';

export const StoreItem = ({
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
        'relative w-[110px] h-[170px] rounded-[12px] overflow-hidden bg-[#063341] border-2 border-[#4D6670] font-gumdrop',
        blocked && 'opacity-50'
      )}
      onClick={handleClick}>
      <div className="h-[110px] flex flex-col items-center justify-center space-y-1 mt-1">
        <Image
          src={`/shop/${item.id}.svg`}
          alt="coin"
          width={400}
          height={400}
          className="w-auto h-16"
        />

        <div className="text-center space-y-0">
          <span className="block text-white text-[20px]">{item.amount}</span>
          <h2 className="text-[12px] text-[#00EDFF99] tracking-wider">{item.text}</h2>
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-[40px] bg-[#4D6670] flex items-center">
        <div className="flex items-center justify-center gap-3 w-full">
          <Image src={StarImage} alt="star" width={120} height={120} className="w-6 h-auto" />
          <span className="text-[14px] text-[#E9E9E999]">{item.price}</span>
        </div>
      </div>
    </div>
  );
};
