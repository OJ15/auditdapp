import React from 'react';

type TokenValueContainerProps = {
  value: string;
  name: string;
};

const TokenValueContainer = React.memo(({ value, name }: TokenValueContainerProps) => {
  return (
    <div className="shadow-md shadow-zinc-600 p-4 rounded-lg overflow-hidden	m-2 bg-gradient-to-r  from-transparent from-10% to-[#19181b] to-70% backdrop-blurr">
      <h1 className="text-white text-lg font-semibold text-center">{value}</h1>
      <p className="text-white uppercase text-xs font-medium text-center">{name}</p>
    </div>
  );
});

export default TokenValueContainer;
