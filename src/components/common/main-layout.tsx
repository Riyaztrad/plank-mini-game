import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import React, { PropsWithChildren } from 'react';

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
});

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className={`text-white ${inter.variable} font-DM_Sans`}>
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
