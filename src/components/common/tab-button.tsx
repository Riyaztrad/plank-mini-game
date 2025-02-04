import clsx from 'clsx';
import Image, { StaticImageData } from 'next/image';

const TabButton = ({
  text,
  image,
  selected,
  onClick,
}: {
  text: string;
  image: StaticImageData;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'flex items-center bg-gradient-to-b rounded-[9px] p-[10px] w-[191px] h-[47px] gap-[7px] border-[1px] border-[#FFFFFF]',
        selected ? 'from-[#1C8F88] to-[#00FFEF]' : 'from-[#23274E4D] to-[#126276E5]'
      )}>
      <Image src={image} alt={'gift'} width={100} height={100} className="w-10 h-auto" />
      <p className="text-[18px] font-genos leading-[20.53px] font-bold w-[136px] tracking-[-2%] text-center">{text}</p>
    </div>
  );
};

export default TabButton;
