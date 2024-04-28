import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import Attributes from './attributes';
import SecurityOverview from './security';
import Statistics from './statistics';

const ICON_SIZE = 32;

const TokenDetailOverView = ({
  tokenMetaData,
  tokenDetails,
  liveData,
}: any) => {
  const { explorerData, socialLinks } = tokenMetaData || {};
  return (
    <div className="flex flex-col gap-6 rounded-lg">
      {/* Token Description */}
      <div>
        {explorerData ? (
          <p className="text-center text-white-400 text-[18px] leading-relaxed tracking-wide rounded-lg">
            {explorerData?.description || ''}
          </p>
        ) : (
          <>
            <Skeleton className="w-[90%] h-4" loading={false} />
            <Skeleton className="w-[90%] h-4 mt-2" loading={false} />
            <Skeleton className="w-1/2 h-4 mt-2" loading={false} />
          </>
        )}
        {/* Social Links */}
        {socialLinks && (
          <div className="flex items-center gap-4 mt-3 justify-center	">
            {socialLinks.website && (
              <Link
                href={socialLinks.website}
                target="_blank"
                className="bg-zinc-900 p-2 rounded-[6px] shadow-md shadow-zinc-600 bg-gradient-to-br  bg-gradient-to-br  from-slate-600  via-[#19181b] to-slate-700 backdrop-blurr"
              >
                <Image
                  src="/icons/social-web.svg"
                  alt="Website Icon"
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
              </Link>
            )}

            {socialLinks.twitter && (
              <Link
                href={socialLinks.twitter}
                target="_blank"
                className="bg-zinc-900 p-2 rounded-[6px] shadow-md shadow-zinc-600 bg-gradient-to-br  from-slate-600  via-[#19181b] to-slate-700 backdrop-blurr"
              >
                <Image
                  src="/icons/social-twitter.svg"
                  alt="Twitter Icon"
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
              </Link>
            )}

            {socialLinks.telegram && (
              <Link
                href={socialLinks.telegram}
                target="_blank"
                className="bg-zinc-900 p-2 rounded-[6px] shadow-md shadow-zinc-600 bg-gradient-to-br  from-slate-600  via-[#19181b] to-slate-700 backdrop-blurr"
              >
                <Image
                  src="/icons/social-telegram.svg"
                  alt="Telegram Icon"
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Token Info Set */}
      <Attributes tokenAddress={tokenMetaData?.address} />

      {/* Token Status in Price */}
      <Statistics liveData={liveData} />

      {/* Token Gauge Chart */}
      <SecurityOverview address={tokenMetaData?.address} />
    </div>
  );
};

export default TokenDetailOverView;
