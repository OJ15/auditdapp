// Import necessary modules/components
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatAddress } from '@/utils/format-address';
import { formatNumber } from '@/utils/format-number';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface Props {
  data: any;
}

const ClusterHold: React.FC<Props> = ({ data }) => {
  const [parsedData, setParsedData] = useState<any>([]);
  const [holders, setHolders] = useState<any>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!data) return;


    let sortedData = data
      .map((d: { balance: any }) => ({
        ...d,
        balance: Number(d.balance),
      }))
      .sort(
        (a: { balance: number }, b: { balance: number }) =>
          b.balance - a.balance
      );

    const total = sortedData.length;
    const percentile1 = sortedData[Math.floor(total * 0.01)].balance;
    const percentile5 = sortedData[Math.floor(total * 0.05)].balance;
    const percentile10 = sortedData[Math.floor(total * 0.1)].balance;

    const parsedData = sortedData.map((node: any) => {
      let color = 'bg-[#1694f1]'; // Default color

      if (node.balance >= percentile1) {
        color = 'bg-[#e247fb]';
      } else if (node.balance >= percentile5) {
        color = 'bg-[#c0f437]';
      }

      return {
        link: node.address,
        label: node.addressLabel?.label || formatAddress(node.address),
        balance: formatNumber(node.balance),
        color,
      };
    });

    setParsedData(parsedData);
    setHolders(parsedData);
  }, [data]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearch(searchValue);

    const filteredData = parsedData.filter((d: any) => {
      return d.label.toLowerCase().includes(searchValue.toLowerCase());
    });

    setSearch(searchValue);
    setHolders(filteredData);
  };
  return (
    <div className="bg-gradient-to-l from-[#1694f1]/10 from-1% via-slate-800 via-40% to-[#e247fb]/10 to-90% p-4 rounded-lg">
      <div className="flex items-center bg-gradient-to-l from-[#1694f1]/10 from-1% via-slate-800 via-40% to-[#e247fb]/10 to-90% p-2 rounded-md mb-3">
        <Image src="/icons/search.svg" alt="Search Icon" width={28} height={28} />
        <input
          type="text"
          autoComplete="off"
          placeholder="Search"
          className="w-full text-white placeholder-gray-500 bg-transparent border-none outline-none ml-2"
          onChange={handleSearch}
          value={search}
        />
      </div>
      <div className="flex flex-row text-xs font-medium uppercase bg-gradient-to-l from-[#1694f1]/10 from-1% via-slate-800 via-40% to-[#e247fb]/10 to-90% border-b border-gray-700 mb-3">
        <div className="flex justify-center p-2 w-1/2">Wallets</div>
        <div className="flex justify-center p-2 w-1/2">Amount</div>
      </div>
      <table className="w-full text-white bg-transparent">
        <ScrollArea className="w-full h-400px">
          <tbody>
            {holders?.map((holder: any, index: any) => (
              <tr
                key={holder.link}
                className={`items-center p-2 m-2 text-sm ${index % 2 !== 0 ? 'bg-[#e247fb]/10' : 'bg-[#e247fb]/20'
                  } h-8`}
              >
                <td className="text-[#c0f437]/50 p-2">
                  {index + 1}
                </td>
                <td className="text-[#1694f1] font-bold">
                  <Link
                    target="_blank"
                    href={`https://etherscan.io/address/${holder.link}`}
                  >
                    {holder.label}
                  </Link>
                </td>
                <td>{holder.balance}</td>
                <td>
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${holder.color}`}
                  ></span>
                </td>
              </tr>
            ))}
          </tbody>
        </ScrollArea>
      </table>
    </div >
  );
};

export default ClusterHold;
