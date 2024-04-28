// Page.tsx

'use client'

import TokenInput from '@/components/ui/token-input-dialog';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Page: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleTokenSubmit = async (tokenAddress: string) => {
    setIsLoading(true);
    await router.push(`/analytics/${tokenAddress}`);
    // setIsLoading(false);
  };

  return (
    <div className="text-white min-h-screen py-12 bg-slate-900 w-full">
      <div className="absolute backdrop-blur-sm inset-0 bg-gradient-to-bl from-[#1694f1] from-1% via-black via-40% to-[#e247fb] to-90% opacity-20"></div>
      <div className="relative overflow-hidden">
        <div className="flex justify-center items-center h-full">
          <TokenInput onSubmit={handleTokenSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Page;
