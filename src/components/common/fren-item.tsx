import { AppColors, DIRECT_REFERRED_COINS_REWARD } from '../../data/constants';
import { Friend } from '../../types/user.interface';
import RocketImage from '../../assets/images/boosts/rocket.png';
import Image from 'next/image';

type Props = {
  user: Friend;
  index: number;
};

const FrenItem = ({ user, index }: Props) => {
  return (
    <div className="flex items-center gap-3 w-full bg-[#063341] rounded-[12px] px-[20px] py-[10px]">
      <div className="grow flex items-center gap-3">
        <div
          className={`w-[40px] h-[40px] flex items-center justify-center font-tacticSans font-bold rounded-full`}
          style={{ backgroundColor: AppColors[index % AppColors.length] }}>
          {user.username.charAt(0).toUpperCase()}
        </div>

        <div className="">
          <div className="w-full flex items-center justify-between">
            <p className="font-gumdrop text-[20px] line-clamp-1">{user.username}</p>
            <div className="rounded-full flex items-center gap-1 bg-[#132e47] px-2 py-1">
              <Image src={RocketImage} alt="coin" width={120} height={120} className="w-5 h-auto" />
              <p className="text-[12px]">+{DIRECT_REFERRED_COINS_REWARD}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-gumdrop text-[12px] text-[#02a3b5]">
              Referrals: <span className="text-[#9bacb3]">{user.totalReferrals}</span>
            </p>
            <p className="font-gumdrop text-[12px] text-[#02a3b5]">
              Frens coins: <span className="text-[#9bacb3]">{user.friendPoints}</span>
            </p>
            <p className="font-gumdrop text-[12px] text-[#02a3b5]">
              Your coins: <span className="text-[#9bacb3]">{user.yourPoints}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrenItem;
