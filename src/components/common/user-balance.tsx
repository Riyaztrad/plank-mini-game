import Image from 'next/image';
import TopScoreImage from '../../assets/images/top-score.png';
import CoinScoreImage from '../../assets/images/coin-score.png';
import Link from 'next/link';

export default function UserBalance({ title, amount }: { title: string; amount: number }) {
  return (
    <Link
      href={'/leaderboard'}
      className="relative rounded-xl mt-1 flex items-start justify-start w-full py-1 bg-gradient-to-b from-[#003330] to-[#003330] border-2 border-[#1C8F88]">
      {/* <Image
        src={title.includes('coin') ? CoinScoreImage : TopScoreImage}
        alt="score"
        width={120}
        height={120}
        className="absolute left-1 w-[50px] h-auto"
      /> */}
      <div className="ml-3 uppercase">
        <p
          className="text-[#1C8F88] text-[20px] mt-1"
          style={{ fontFamily: 'Genos', fontWeight: 700, textTransform: 'none' }}>
          {title}
        </p>
        <p className="text-[20px] -mt-1">{amount}</p>
      </div>
    </Link>
  );
}
