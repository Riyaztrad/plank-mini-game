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
        'flex items-center bg-gradient-to-b rounded-[16px] border-2 border-[#07B1C3]',
        selected ? 'from-[#3FFECF] to-[#4D6E75]' : 'from-[#23274E4D] to-[#126276E5]'
      )}>
      <Image src={image} alt={'gift'} width={100} height={100} className="w-10 h-auto" />
      <p className="text-[14px] font-gumdrop w-full text-center">{text}</p>
    </div>
  );
};

export default TabButton;
