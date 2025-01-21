import Image from 'next/image';
import TopScoreImage from '../../assets/images/top-score.png';
import CoinScoreImage from '../../assets/images/coin-score.png';
import Link from 'next/link';

export default function UserBalance({ title, amount }: { title: string; amount: number }) {
  return (
    <Link
      href={'/leaderboard'}
      className="relative rounded-xl flex items-center justify-center w-full py-1 bg-gradient-to-b from-[#23274E4D] to-[#126276E5] border-2 border-[#0D4C60]">
      <Image
        src={title.includes('coin') ? CoinScoreImage : TopScoreImage}
        alt="score"
        width={120}
        height={120}
        className="absolute left-1 w-[50px] h-auto"
      />
      <div className="ml-10 font-gumdrop uppercase">
        <p className="text-[#0ea2b5] text-[12px] mt-1">{title}</p>
        <p className="text-[20px] -mt-1">{amount}</p>
      </div>
    </Link>
  );
}
