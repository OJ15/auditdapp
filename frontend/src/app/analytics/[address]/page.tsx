// Import necessary components and hooks
'use client'
import ChatWindow from '@/components/analytics/chat-window';
import GraphOrderBook from '@/components/analytics/graphs/order-book';
import DropdownSwitcher from '@/components/analytics/graphs/switcher-dropdown';
import GraphVolume from '@/components/analytics/graphs/volume';
import GraphWallets from '@/components/analytics/graphs/wallets';
import TokenHeader from '@/components/analytics/header';
import TokenOverview from '@/components/analytics/overview';
import TableSwitcher from '@/components/analytics/transactions/switcher-table';
import TableTrades from '@/components/analytics/transactions/trades';
import useLiveData from '@/hooks/useLiveData';
import useTokenInfo from '@/hooks/useTokenInfo';
import { useState } from 'react';

// Define Props type
type Props = {
  params: {
    address: string;
  };
};
const Analytics = ({ params }: Props) => {
  // Extract contract address from params
  const contractAddress = params.address;

  // State variables
  const [tokenDetails, setTokenDetails] = useState<any>(null);
  const [showSection, setShowSection] = useState('info');

  // Fetch token info and live data
  const { isFetching, tokenInfo, error } = useTokenInfo(contractAddress, 'meta', true);
  const liveData = useLiveData(contractAddress);

  const sectionsArr = [
    {
      name: 'Token info',
      val: 'info',
    },
    {
      name: 'Chart+Txns',
      val: 'chart',
    },
    {
      name: 'Volume+Wallets',
      val: 'volume',
    },
  ];

  const graphVolumeProps = {
    address: contractAddress,
    resolution: '1h' // default resolution
  }

  return (
    <div className="text-white min-h-screen py-12 bg-slate-800 w-full">
      <div className="absolute  backdrop-blur-sm	inset-0 bg-gradient-to-bl from-[#1694f1] from-1% via-black via-40% to-[#e247fb] to-90% opacity-20"></div>
      <div className="relative overflow-hidden">
        <div className="mx-auto">
          {/* TokenHeader */}
          {/* <h2 className="text-2xl font-bold text-white mb-4">Token Overview</h2> */}
          <TokenHeader showTitle={true} liveData={liveData} metadata={tokenInfo} />

          <div className="mt-8">
            {/* TokenOverview */}
            <div className=" rounded-lg p-6 mb-8">
              <TokenOverview tokenMetaData={tokenInfo} tokenDetails={tokenDetails} liveData={liveData} />
            </div>

            {/* Graphs */}
            <div className="bg-transparent rounded-lg shadow-md p-6 mb-8 ">
              <div className="grid grid-cols-1 md:grid-cols-1 md:gap-8 ">
                <div>
                  <GraphVolume {...graphVolumeProps} />

                  {/* <GraphVolume address={contractAddress} defaultResolution={'1h'} /> */}
                </div>
                <div>
                  <DropdownSwitcher
                    graphs={[
                      {
                        name: 'Top Holders',
                        component: GraphWallets,
                        props: { address: contractAddress, symbol: (tokenInfo as any)?.symbol, limit: 100 },
                      },
                      {
                        name: 'Order Book',
                        component: GraphOrderBook,
                        props: {
                          pair: liveData?.pairAddress,
                          exchange: liveData?.dexId,
                          labels: liveData?.labels,
                          priceUsd: liveData?.priceUsd,
                        },
                      },
                    ]}
                    defaultResolution={'1W'}
                  />
                </div>
              </div>
            </div>
            {/* Tables */}
            <div className="bg-gradient-to-l from-[#1694f1]/20 from-1% via-slate-800 via-40% to-[#e247fb]/20 to-90% rounded-lg shadow-md p-6 mb-8">
              <div>
                <TableSwitcher
                  tables={[
                    {
                      name: 'Trades',
                      component: TableTrades,
                      props: { pair: liveData?.pairAddress, symbol: liveData?.baseToken.symbol, base: liveData?.quoteToken.symbol },
                    }
                  ]}
                />
              </div>
            </div>
            <div className="fixed bottom-8 right-8 z-50">
              <ChatWindow />
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

// Export Analytics component
export default Analytics;
