import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatNumber } from '@/utils/format-number';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { RiSkullFill } from "react-icons/ri";
import { SiFsecure } from "react-icons/si";

const TokenAttributes = ({ tokenAddress }: any) => {
  const [loading, setLoading] = useState(true);
  const [attributes, setAttributes] = useState([
    {
      key: 'Total Supply',
      value: '', 
      description: 'Amount of tokens minted',
    },
    {
      key: 'LP Holder(s)',
      value: '',
      description: 'Entities holding Liquidity Pools',
    },
    {
      key: 'Opensource',
      value: '',
      description: 'Is the contract code available and verified?',
      boolean: true,
      good: true,
    },
    {
      key: 'Anti-whale',
      value: '',
      description: 'Is there a max transaction limit?',
      boolean: true,
      good: false,
    },
    {
      key: 'Ownership Renounced',
      value: '',
      description: 'Has the owner renounced ownership?',
      boolean: true,
      good: true,
    },
    {
      key: 'Mintable',
      value: '',
      description: 'Can the contract mint new tokens?',
      boolean: true,
      good: false,
    },
    {
      key: 'Blacklist',
      value: '',
      description: 'Can the contract blacklist wallets?',
      boolean: true,
      good: false,
    },
  ]);

  useEffect(() => {
    if (!tokenAddress) return;

    const fetchData = async () => {
      axios
        .get(`/api/token/info?address=${tokenAddress}&type=security`)
        .then(response => {
          const data = response.data;


          let ownership_renounced = 0;
          const burn_addresses = [
            '0x000000000000000000000000000000000000dead',
            '0x0000000000000000000000000000000000000000',
          ];
          if (burn_addresses.includes(data.owner_address.toLowerCase())) {
            ownership_renounced = 1;
          }

          setAttributes(
            attributes.map(attr => ({
              ...attr,
              value:
                attr.key === 'Total Supply'
                  ? data.total_supply
                  : attr.key === 'LP Holder(s)'
                    ? data.lp_holder_count
                    : attr.key === 'Opensource'
                      ? data.is_open_source
                      : attr.key === 'Anti-whale'
                        ? data.is_anti_whale
                        : attr.key === 'Ownership Renounced'
                          ? ownership_renounced
                          : attr.key === 'Mintable'
                            ? data.is_mintable
                            : attr.key === 'Blacklist'
                              ? data.is_blacklisted
                              : attr.value,
            }))
          );

          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching live data:', error);
          setLoading(false);
        });
    };

    fetchData();
  }, [tokenAddress]);

  if (loading) {
    return (
      <div className="w-full">
        <Skeleton className="w-full h-96" loading={loading} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <TooltipProvider>
        {attributes.map((attribute: any) => (
          <div
            className="w-full flex items-center py-1 m-2 p-8"
            key={attribute.key}
          >
            <div className="flex gap-[4px] items">
              <p className="text-white text-[16px] font-semibold">
                {attribute.key}
              </p>
              <Tooltip>
                <TooltipTrigger>
                  <Image
                    src="/icons/info.svg"
                    alt="info-icon"
                    width={13}
                    height={13}
                    className="mr-5"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className='bg-[#19181b]'>{attribute.description}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            {loading ? (
              <Skeleton className="w-6 h-2" loading={loading} />
            ) : (
              <p className="text-white text-[16px]">
                {attribute.boolean
                  ? (() => {
                    const isValueGood = attribute?.value === '1'; // assuming '1' is good and '0' is bad
                    return isValueGood !== attribute?.good ? (
                      <RiSkullFill className="text-[#e247fb] " />
                    ) : (
                      <SiFsecure className="text-[#c0f437]" />
                    );
                  })()
                  : formatNumber(attribute.value)}
              </p>
            )}
          </div>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default TokenAttributes;
