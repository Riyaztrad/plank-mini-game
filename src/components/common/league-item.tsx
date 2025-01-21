import clsx from 'clsx';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Check } from 'lucide-react';
import CoinImage from '../../assets/images/coin.png';
import GiftImage from '../../assets/images/gift.png';
import { League } from '../../types/league.interface';

export const LeagueItem = ({
  league,
  onComplete,
  currentLeague,
}: {
  league: League;
  onComplete: (leagueId: number) => void;
  currentLeague: boolean;
}) => {
  // const handleClaim = async () => {
  //   onComplete(league.id);
  // };
  return (
    <div
      className={clsx(
        'flex items-center gap-3 w-full bg-[#063341] rounded-[12px] px-4 py-2',
        currentLeague && 'border-2 border-[#00EDFF]'
      )}>
      <p className="font-gumdrop text-[#3FFECF]">{league.id + 1}</p>
      <div className="w-10 h-10 flex items-center justify-center">
        <Image
          src={league.image}
          alt={league.title}
          width={100}
          height={100}
          className="w-full h-auto"
        />
      </div>
      <div className="w-0 grow min-w-[120px]">
        <span className="text-[14px] font-gumdrop">{league.title}</span>
        <div className="flex items-center gap-1 -mt-1">
          <Image src={CoinImage} alt={'coin'} width={100} height={100} className="w-5 h-auto" />
          <p className="font-gumdrop text-[#02a4b3] text-[12px]">{league.description}</p>
        </div>
      </div>
      {/* {!league.completed ? ( */}
      <Button
        disabled={league.completed}
        // onClick={handleClaim}
        className="bg-[#162e47] text-[10px] text-white py-1 flex items-center gap-1">
        <Image src={GiftImage} alt={'gift'} width={100} height={100} className="w-6 h-auto" />

        <div className="flex flex-col items-center">
          <p className="font-light uppercase text-[10px]">Rewards pool</p>
          <span>
            ESX{' '}
            {league.rewardsPool.toLocaleString('en-us', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
      </Button>
      {/* ) : ( */}
      {/* <Button className="bg-[#3FFECF] text-[10px] text-black py-1">
          <Check className="w-4 h-4" />
        </Button> */}
      {/* )} */}
    </div>
  );
};
