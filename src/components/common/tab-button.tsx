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
        'flex items-center  bg-gradient-to-b rounded-[9px] p-2 h-[47px]  gap-[7px] border-[1px] border-[#FFFFFF]',
       selected ? 'from-[#1C8F88] to-[#00FFEF]' : 'from-[#23274E4D] to-[#126276E5]'
      )}>
      <Image src={image} alt={'gift'} width={100} height={100} className="w-[27px] h-[27px] " />
      <p className="text-[12px] font-genos leading-[20.53px] font-bold tracking-[-0.02em] text-left">{text}</p>

    </div>
  );
};

export default TabButton;
