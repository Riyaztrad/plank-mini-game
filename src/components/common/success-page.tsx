import { X } from 'lucide-react';
import React, { PropsWithChildren } from 'react';
import Confetti from 'react-confetti';

interface Props extends PropsWithChildren {
  className?: string;
  onClose: () => void;
}

const SuccessPage = ({ children, className, onClose }: Props) => {
  return (
    <div className="h-full flex flex-col">
      <div className="h-screen w-screen fixed left-0 top-0 z-0">
        <Confetti tweenDuration={10000} recycle={false} numberOfPieces={500} />
      </div>
      <div className="flex justify-end relative z-10">
        <button onClick={onClose}>
          <X />
        </button>
      </div>
      <div className={`grow relative z-10 ${className}`}>{children}</div>
    </div>
  );
};

export default SuccessPage;
