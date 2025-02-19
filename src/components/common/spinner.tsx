type IconProps = React.HTMLAttributes<SVGElement>;

interface SpinnerProps extends IconProps {}

export const Spinner: React.FC<SpinnerProps> = (props: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='80'
    height='80'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    {...props}
  >
    <path d='M21 12a9 9 0 1 1-6.219-8.56' />
  </svg>
);
