import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { Task } from '../../types/task.interface';
import { completeTask, getTasks } from '../../services/task.service';
import { TaskItem } from '../../components/common/task-item';
import { useUserStore } from '../../store/userStore';
import { Button } from '../../components/ui/button';
import Navbar from '../../components/common/navbar';
import { useToast } from '../../hooks/use-toast';
import CoinImage from '../../assets/images/points.png';
import Image from 'next/image';
import ConnectWalletDrawer from '../../components/common/connect-wallet-drawer';
import { ConnectWalletItem } from '../../components/common/connect-wallet-item';
import EarnDrawer from '../../components/common/earn-drawer';
import TaskDrawer from '../../components/common/task-drawer';
import { Boost } from '../../types/boost.interface';
import { getUserData } from '../../services/user.service';
import { useRouter } from 'next/navigation';

const Tasks: NextPage = () => {
  const { user, setUser } = useUserStore();
  const { toast } = useToast();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [walletDrawerOpen, setWalletDrawerOpen] = useState(false);
  const [earnDrawerOpen, setEarnDrawerOpen] = useState(false);
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [rewardBoosts, setRewardBoosts] = useState<Boost[]>([]);

  useEffect(() => {
    getTasksFromApi();
  }, [user]);

  const getTasksFromApi = async () => {
    if (!user) return;

    const res = await getTasks(user.id);
    console.log(res);
    setTasks(res);
  };

  const handleCompleteTask = async (task: Task) => {
    if (!user) return;

    const rewards = await completeTask(user.id, task.id);
    if (!rewards) {
      toast({
        title: 'Oops!',
        description: 'Task requirements not met',
      });
      console.log('social media:', task.socialMedia);
      if (task.socialMedia.includes('friends')) {
        router.push('/frens');
      }
      return;
    }
    setRewardPoints(rewards.points);
    setRewardBoosts(rewards.boosts);

    console.log('points ', rewards.points, 'boosts ', rewards.boosts);

    const updatedUser = await getUserData(user.id);
    setUser(updatedUser);

    setTaskDrawerOpen(true);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-screen bg-[url('/tasks-banner.png')] bg-cover bg-center bg-no-repeat flex flex-col px-5 overflow-y-auto">
      <div className="flex flex-col w-full">
        <div className="mx-auto font-gumdrop uppercase text-center pt-8">
          <p className="text-[20px] text-[#0ea2b5]">your coin balance</p>
          <div className="flex items-center">
            <Image src={CoinImage} alt="coin" width={120} height={120} className="w-20 h-auto" />
            <p className="text-[48px]">{user?.points}</p>
          </div>
          <Button variant={'silver'} onClick={() => setEarnDrawerOpen(true)}>
            How it works
          </Button>
        </div>
        <div
          className="space-y-2 mt-10 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 320px)' }}>
          {tasks.map((task, index) => (
            <TaskItem task={task} key={index} onComplete={handleCompleteTask} />
          ))}
          <ConnectWalletItem
            connected={Boolean(user?.walletAddress)}
            onConnectWallet={() => setWalletDrawerOpen(true)}
          />
        </div>
      </div>
      <div className="mt-auto">
        <Navbar />
      </div>
      <ConnectWalletDrawer open={walletDrawerOpen} setOpen={setWalletDrawerOpen} />
      <EarnDrawer open={earnDrawerOpen} setOpen={setEarnDrawerOpen} />
      <TaskDrawer
        open={taskDrawerOpen}
        setOpen={setTaskDrawerOpen}
        points={rewardPoints}
        boosts={rewardBoosts}
      />
    </div>
  );
};

export default Tasks;
