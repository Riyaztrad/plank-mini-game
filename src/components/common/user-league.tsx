import Image from 'next/image';
import { UserLeague } from '../../types/user.interface';
import { ChevronDown } from 'lucide-react';

export default function LeaguePreview({ league }: { league: UserLeague }) {
  return (
    <div className="relative rounded-xl flex items-center justify-between w-full mx-2 px-4 bg-gradient-to-b from-[#23274E4D] to-[#126276E5] border-2 border-[#0D4C60]">
      <Image
        src={league.image}
        alt={league.title}
        width={120}
        height={120}
        className="absolute left-2 w-[60px] h-[60px]"
      />
      <div className="ml-20 font-gumdrop uppercase">
        <p className="text-[#0ea2b5] text-[12px] mt-1">League</p>
        <p className="text-[20px] -mt-1">{league.title}</p>
      </div>
      <div>
        <ChevronDown />
      </div>
    </div>
  );
}
