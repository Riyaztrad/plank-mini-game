import { useState } from 'react';
import { Task } from '../../types/task.interface';
import Image from 'next/image';
import TaskImage from '../../assets/images/task.png';
import { Button } from '../ui/button';
import CoinImage from '../../assets/images/points.png';
import CheckImage from '../../assets/images/check.svg';
import { TaskBoost } from './task-boost';
import clsx from 'clsx';

export const TaskItem = ({
  task,
  onComplete,
}: {
  task: Task;
  onComplete: (task: Task) => void;
}) => {
  const [executed, setExecuted] = useState(false);

  const handleClaim = () => {
    onComplete(task);
  };

  return (
    <div
      className={clsx(
        'flex items-center gap-3 w-full bg-[#063341] rounded-[12px] px-[20px] py-[10px]',
        task.completed && 'opacity-50'
      )}>
      <div className="grow flex items-center gap-3">
        <Image
          src={task.completed ? CheckImage : TaskImage}
          alt="task"
          width={400}
          height={400}
          className="w-6 h-auto"
        />

        <div className="w-full">
          <p className="font-gumdrop text-[20px] line-clamp-1 leading-none mt-1">{task.title}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-[12px]">
              <Image src={CoinImage} alt="coin" width={120} height={120} className="w-8 h-auto" />
              <p className="text-[#02a3b5] font-gumdrop">{task.points} coins</p>
            </div>
            <TaskBoost
              boostId={task.boosts[0].id}
              amount={task.boosts[0].amount}
              name={task.boosts[0].name}
            />
          </div>
        </div>

        {!executed && task.externalUrl !== '' ? (
          <a
            href={task.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setExecuted(true)}>
            <Button disabled={task.completed} variant={'silver'} className="py-1 px-3 rounded-full">
              Execute
            </Button>
          </a>
        ) : (
          <Button
            disabled={task.completed}
            onClick={handleClaim}
            variant={'silver'}
            className="py-1 px-3 rounded-full">
            Claim
          </Button>
        )}
      </div>
    </div>
  );
};
