import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Links } from '../../data/constants';

const Navbar = () => {
  const { pathname } = useRouter();

  return (
    <div className="mt-4 z-10 border-t border-white/10 pt-4">
      <div className="grid grid-cols-5">
        {Links.map((link, index) => (
          <Link href={link.href} key={index}>
            <div className="flex flex-col items-center justify-center">
              {React.createElement(link.icon, {
                className:
                  pathname === link.href ? '[&_*]:stroke-primary [&_*]:fill-primary pulsing' : '',
              })}
              <span
                className={`text-[13px] font-medium ${
                  link.href === pathname ? 'text-primary' : 'text-white'
                }`}>
                {link.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
