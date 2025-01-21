import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import Image from 'next/image';
import CheckImage from '../../assets/images/check.svg';

export default function PurchaseSuccess() {
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount');
  const address = searchParams.get('address');

  return (
    <div className="fixed left-0 top-0 h-screen w-screen bg-[url('/bg-success.png')] flex flex-col p-5 overflow-y-auto">
      <div className="flex flex-col gap-4 items-center mt-44 text-center">
        <Image src={CheckImage} alt="coin" width={120} height={120} className="w-16 h-auto" />

        <h2 className="text-[48px] font-gumdrop leading-none">Successful Transaction</h2>

        <h2 className="text-[18px] font-semibold">Transaction Summary</h2>
        <p className="text-sm">Total: {amount} TON</p>
        {/* <div className="flex items-center justify-center gap-6">
          <p>{address?.substring(0, 12)}...</p>
          <a
            href={`https://tonscan.org/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3FFECF]">
            View on Tonscan
          </a>
        </div> */}
      </div>

      <Link href={'/home'} className="w-full mt-auto">
        <Button className="w-full py-3 text-[30px]" variant={'silver'}>
          Main Menu
        </Button>
      </Link>
    </div>
  );
}
