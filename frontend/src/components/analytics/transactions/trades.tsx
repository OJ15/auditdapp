import { formatAddress } from '@/utils/format-address';

import axios from 'axios';
import { useMemo, useState } from 'react';
// import SelectTopToken from '../select-top-token';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatAge } from '@/utils/format-age';
import { formatNumber } from '@/utils/format-number';
import TableHead from '../table-head';

const TradesTable = ({ pair, symbol, base }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [trades, setTrades] = useState<any[]>([]);

  const transformTradeData = (tradeData: any) => {
    return tradeData.map((trade: any) => {
      const isBuy = trade.attributes.kind === 'buy';

      const dateString = trade.attributes.block_timestamp;
      const date = new Date(dateString);
      const unixTimestamp = Math.floor(date.getTime() / 1000);

      let color = 'text-lime-400';

      if (!isBuy) {
        color = 'text-purple-400';
      }

      return {
        hash: trade.attributes.tx_hash,
        block_number: trade.attributes.block_number,
        timestamp: unixTimestamp,
        tokens: isBuy
          ? trade.attributes.from_token_amount
          : trade.attributes.to_token_amount,
        price: isBuy
          ? trade.attributes.price_to_in_usd
          : trade.attributes.price_from_in_usd,
        currency: isBuy
          ? trade.attributes.price_to_in_currency_token
          : trade.attributes.price_from_in_currency_token,
        volume: trade.attributes.volume_in_usd,
        address: trade.attributes.tx_from_address,
        color,
      };
    });
  };

  useMemo(() => {
    if (!pair) return;

    const loadData = async () => {
      const response = await axios.get(
        `/api/analytics/trades?address=${pair.toLowerCase()}`
      );

      setTrades(transformTradeData(response.data.data));
      setIsLoading(false);
    };

    loadData();
  }, [pair]);

  return (
    <div className="h-[400px] overflow-auto bg-gradient-to-l from-[#1694f1]/10 from-1% via-slate-800 via-40% to-[#e247fb]/10 to-90%">
      {isLoading ? (
        <Skeleton className="w-full h-96 bg-gradient-to-l from-[#1694f1]/10 from-1% via-slate-800 via-40% to-[#e247fb]/10 to-90%" loading={isLoading} />
      ) : (
        <Table className="w-full">
          {/* <div className="sticky top-0"> */}
          <TableHead tableHead={['', 'Address', 'Amount', 'Price', 'Time']} />
          <TableBody>
            {trades?.map(item => (
              <TableRow
                key={item?.id}
                className="w-full border-b border-zinc-800"
              >
                <TableCell className="items-center">
                  {symbol}/<span className="text-gray-500">{base}</span>
                </TableCell>
                <TableCell className="text-blue-400 text-[14px]">
                  {formatAddress(item.address)}
                </TableCell>
                <TableCell className={item.color}>
                  ${formatNumber(item.volume)}
                </TableCell>
                <TableCell className={`min-w-[90px] ${item.color}`}>
                  ${Number(item.price).toFixed(5)}
                </TableCell>
                <TableCell className="">
                  {formatAge(parseInt(item.timestamp) * 1000, true)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TradesTable;
