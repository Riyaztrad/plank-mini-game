import Image from 'next/image';
import TaskImage from '../../assets/images/task.png';
import { Button } from '../ui/button';
import CoinImage from '../../assets/images/points.png';
import CheckImage from '../../assets/images/check.svg';

import clsx from 'clsx';
import { CONNECT_WALLET_POINTS_REWARD } from '../../data/constants';

export const ConnectWalletItem = ({
  connected,
  onConnectWallet,
}: {
  connected: boolean;
  onConnectWallet: () => void;
}) => {
  return (
    <div
      className={clsx(
        'flex items-center gap-3 w-full bg-[#063341] rounded-[12px] px-[20px] py-[10px]',
        connected && 'opacity-50'
      )}>
      <div className="grow flex items-center gap-3">
        <Image
          src={connected ? CheckImage : TaskImage}
          alt="task"
          width={400}
          height={400}
          className="w-6 h-auto"
        />

        <div className="w-full">
          <p className="font-gumdrop text-[20px] line-clamp-1 leading-none mt-1">Connect Wallet</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-[12px]">
              <Image src={CoinImage} alt="coin" width={120} height={120} className="w-8 h-auto" />
              <p className="text-[#02a3b5] font-gumdrop">{CONNECT_WALLET_POINTS_REWARD} coins</p>
            </div>
          </div>
        </div>

        {!connected ? (
          <Button onClick={onConnectWallet} variant={'silver'} className="py-1 px-3 rounded-full">
            Connect
          </Button>
        ) : (
          <Button disabled={true}>Connected</Button>
        )}
      </div>
    </div>
  );
};
