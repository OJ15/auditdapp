import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import WalletBubble from './bubble';
import WalletTable from './table';

const WalletsGraph: React.FC<{
  address: string;
  symbol: string;
  limit?: number;
}> = ({ address, symbol, limit }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);

    const loadData = async () => {
      const queryString = qs.stringify({
        type: 'holders',
        address,
        symbol,
        limit,
      });
      const response = await axios.get(`/api/analytics?${queryString}`);
      setData(response.data);
      setLoading(false);
    };

    loadData();
  }, [address]);

  if (isLoading) {
    return (
      <Skeleton className="w-full h-[320px] aspect-landscape translate-y-12 bg-gradient-to-l from-[#1694f1]/10 from-1% via-slate-800 via-40% to-[#e247fb]/10 to-90%" loading={isLoading} />
    );
  }

  return (
    <div className="w-full translate-y-12 bg-transparent">
      <div className="w-full  flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 max-h-[320px]">
          <WalletBubble data={data} />
        </div>
        <div className="w-full md:w-1/2">
          <div className="max-h-[320px] overflow-y-auto">
            <WalletTable data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletsGraph;
