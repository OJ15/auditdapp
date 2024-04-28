import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber } from '@/utils/format-number';
import React, { useEffect, useState } from 'react';

const Statistic: React.FC<{ value: string; subLabel?: string; percentage?: boolean }> = ({ value, subLabel, percentage }) => {
  // Determine text color based on percentage
  const colorClass = percentage ? (parseFloat(value) >= 0 ? 'text-[#c0f437]' : 'text-[#e247fb]') : 'text-white'; // Use text-white as default

  return (
    <div className="col-span-1 flex flex-col items-center gap-2 rounded-[4px] bg-gradient-to-r from-slate-800 from 30%  to-slate-800/70 p-2 transition-all ease-in duration-100 cursor-pointer">
      <h1 className={`${colorClass} text-[14px] leading-[16px] text-center`}>{value}</h1>
      {subLabel && (
        <p className="text-gray-400 text-[10px] pt-1 uppercase">{subLabel}</p>
      )}
    </div>
  );
};

const TokenStatistics = ({ liveData }: any) => {
  const [active, setActive] = useState('24h');
  const [loading, setLoading] = useState(true);
  const btnArr = ['1h', '6h', '24h'];
  const switchRes: { [key: string]: string } = {
    '1h': 'h1',
    '6h': 'h6',
    '24h': 'h24',
  };

  useEffect(() => {
    setLoading(!liveData); // Updated condition
  }, [liveData]);

  const getStatValue = (key: string) => liveData?.[key]?.[switchRes[active]];

  return (
    <div className="border border-zinc-900/30 p-3 flex flex-col gap-3">
      {/* Button Group */}
      <div className="flex justify-between bg-zinc-900 rounded-[6px]">
        {btnArr.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setActive(item)}
            className={`p-1 px-2 w-full text-sm ${item === active ? 'text-white bg-gradient-to-r from-[#1694f1]/50 via-[#e247fb]/20 to-[#1694f1]/30' : 'text-gray-300 bg-slate-800 hover:text-white transition-all ease-in duration-150'
              }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-4 gap-3">
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-full h-10 m-2 bg-slate-800/50" loading={loading} />
            ))}
          </>
        ) : (
          <>
            <Statistic value={getStatValue('txns')?.buys} subLabel="Buys" />
            <Statistic value={getStatValue('txns')?.sells} subLabel="Sells" />
            <Statistic value={getStatValue('priceChange')} subLabel="Change" percentage={true} />
            <Statistic value={formatNumber(getStatValue('volume'))} subLabel="Volume" />
          </>
        )}
      </div>
    </div>
  );
};

export default TokenStatistics;
