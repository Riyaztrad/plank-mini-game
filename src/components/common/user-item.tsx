import { AppColors } from '../../data/constants';
import { LeaderboardUser } from '../../types/user.interface';

type Props = {
  user: LeaderboardUser;
  index: number;
};

const UserItem = ({ user, index }: Props) => {
  return (
    <div className="flex items-center gap-3 w-full bg-[#063341] rounded-[12px] px-[20px] py-[10px]">
      <div className="font-gumdrop text-[#3FFECF] text-[20px] text-center">{index}</div>
      <div className="grow flex items-center gap-3">
        <div
          className={`w-[40px] h-[40px] flex items-center justify-center font-tacticSans font-bold rounded-full`}
          style={{ backgroundColor: AppColors[index % AppColors.length] }}>
          {user.username.charAt(0).toUpperCase()}
        </div>

        <div className="">
          <p className="font-gumdrop text-[20px] line-clamp-1">{user.username}</p>
          <p className="font-gumdrop text-[12px] text-[#02a3b5]">{user.points}</p>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
