'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '../../ui/skeleton';
import PieGraph from './security-pie-chart';

const SecurityOverview: React.FC<{
  address: string;
}> = ({ address }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [score, setScores] = useState({} as any);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!address) return;

    setLoading(true);

    const loadData = async () => {
      const response = await axios.get(
        `/api/token/info?address=${address}&type=scan`
      );

      const data = response.data;

      setTotal(Math.round(data.auditScore));

      setData([
        {
          score: data.securityScore,
          label: 'Security',
          description:
            data.securityScore < 50
              ? 'Owners have some control'
              : data.securityScore < 25
                ? 'Practice Caution'
                : 'No suspicious activity',
        },
        {
          score: data.decentralisationScore,
          label: 'Governance',
          description:
            data.decentralisationScore < 50
              ? 'Slightly centralized'
              : data.decentralisationScore < 25
                ? 'Centralized'
                : 'Sufficiently decentralized',
        },
        {
          score: data.communityScore,
          label: 'Community',
          description:
            data.communityScore < 50
              ? 'Growth needed'
              : data.communityScore < 25
                ? 'Not enough activity'
                : 'Very active community',
        },
        {
          score: data.marketScore,
          label: 'Market',
          description:
            data.marketScore < 50
              ? 'Low trading'
              : data.marketScore < 25
                ? 'Not enough trading'
                : 'Active trading',
        },
      ]);
      //   console.log('response', response);
      setLoading(false);
    };

    loadData();
  }, [address]);

  const getColor = (score: number) => {
    const colorRanges: { [key: string]: number } = {
      red: 25,    // Increased threshold for red
      orange: 50,
      yellow: 75,
      green: 100, // Removed 'blue'
    };

    const colorKey = Object.keys(colorRanges).find(
      (key: keyof typeof colorRanges) => score <= colorRanges[key]
    ) || 'red';

    switch (colorKey) {
      case 'red':
        return { startColor: '[#e247fb]', endColor: '[#e247fb]' };
      case 'orange':
        return { startColor: '[#e247fb]', endColor: '[#e247fb]' };
      case 'yellow':
        return { startColor: 'yellow-400', endColor: 'yellow-700' };
      case 'green':
      default:
        return { startColor: 'green-600', endColor: 'green-800' };
    }
  };

  if (isLoading) {
    return <Skeleton className="w-[100%] h-[320px] aspect-square" loading={isLoading} />;
  }
  return (
    <div className="border border-zinc-900/30  p-3 flex flex-col items-around justify-center gap-3 rounded-lg shadow-lg">
      {/* Updated container styling */}

      <PieGraph value={total} height={290} labels={true} />

      <p className="text-gray-300 text-center font-bold mb-3">
        {/* Adjusted text color */}
        {total < 50 ? 'Caution Advised' : total < 20 ? 'High Risk' : 'Neutral Risk'}
      </p>
      {data.map((item: any, index: any) => (
        <div
          key={index}
          // className={`flex flex-row justify-between w-full p-3 rounded-md bg-gradient-to-r from-${getColor(item.score).startColor} to-${getColor(item.score).endColor}`}

          className="flex flex-row justify-between w-full p-3 rounded-md bg-gradient-to-r from-slate-700/70 via-[#e247fb]/40 to-[#1694f1]/50"
          style={{ width: `${item.score}%` }}
        >
          <div className="font-semibold text-lg text-white">{item.label}</div>
          <div className="ml-2 w-[30px] font-bold text-lg text-right text-white font-mono">
            {item.score}%
          </div>
        </div>
      ))}


    </div>
  );
};

export default SecurityOverview;