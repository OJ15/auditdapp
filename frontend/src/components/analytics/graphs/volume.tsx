import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface DataItem {
  endTs: number;
  value: number;
}

const TransferVolumeGraph: React.FC<{ address: string }> = ({ address }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [resolution, setResolution] = useState('1h'); // Default resolution

  const resolutionFilter = ['1m', '5m', '15m', '1h', '2h', '4h'];

  const loadData = async () => {
    setLoading(true);
    try {
      const queryString = qs.stringify({
        type: 'volume',
        address,
        resolution,
      });
      const response = await axios.get(`/api/analytics?${queryString}`);
      const updatedData = response.data
        .sort((a: DataItem, b: DataItem) => b.endTs - a.endTs)
        .slice(0, 20)
        .map((item: DataItem) => ({
          formattedDate: item.endTs,
          value: item.value
        }));

      setData(updatedData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(); // Using toLocaleDateString to format the date
  };

  const formatYAxisLabel = (value: number) => {
    if (value >= 1e15) {
      return `${(value / 1e15).toFixed(3)}Q`; // Rounded value in quadrillions with three decimal places
    } else if (value >= 1e12) {
      return `${(value / 1e12).toFixed(3)}T`; // Rounded value in trillions with three decimal places
    } else if (value >= 1e9) {
      return `${(value / 1e9).toFixed(3)}B`; // Rounded value in billions with three decimal places
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(3)}M`; // Rounded value in millions with three decimal places
    } else {
      return value.toString();
    }
  };

  useEffect(() => {
    loadData();
  }, [address, resolution]);

  const handleResolutionChange = (value: string) => {
    setResolution(value);
  };

  return (
    <div className="w-full h-[300px] bg-slate-800/50 rounded-md p-3 bg-gradient-to-l from-[#1694f1]/10 from-1% via-slate-800 via-40% to-[#e247fb]/10 to-90%">
      <div className="flex items-center justify-between mb-3">
        <Skeleton loading={isLoading} className="w-24 h-6" />
        <div className="relative z-20">
          <select
            value={resolution}
            onChange={(e) => handleResolutionChange(e.target.value)}
            className="w-24 bg-zinc-900 rounded-md outline-none p-1 text-white bg-gradient-to-l from-[#1694f1]/10 from-1% via-slate-800 via-40% to-[#e247fb]/10 to-90%"
          >
            {resolutionFilter.map((res) => (
              <option key={res} value={res}>
                {res}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="w-full h-[250px] aspect-square" loading={isLoading} />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 30, bottom: 0 }} // Increase left margin for additional space
          >
            <CartesianGrid strokeDasharray="1 1" stroke="slate-800" opacity={0.2} />
            <XAxis
              dataKey="formattedDate"
              tickFormatter={formatTimestamp}
              tick={{ fill: '#c0f437', fontSize: '12px' }}
              axisLine={{ stroke: '#c0f437', strokeOpacity: 0.4 }}
              interval={0} // interval to 0 to display all labels
              angle={-45} // Rotate the labels
              textAnchor="end"
            />
            <YAxis
              tickFormatter={formatYAxisLabel}
              tick={{ fill: '#c0f437', fontSize: '12px' }}
              axisLine={{ stroke: '#c0f437', strokeOpacity: 0.3 }}
              label={{ value: 'Volume', angle: -90, position: 'insideLeft', fill: '#c0f437' }}
            />
            <Tooltip contentStyle={{ backgroundColor: '#e247fb', color: '#FFFFFF', border: 'none' }} labelStyle={{ color: '#slate-800' }} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#c0f437" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>

      )}
    </div>
  );
};

export default TransferVolumeGraph;
