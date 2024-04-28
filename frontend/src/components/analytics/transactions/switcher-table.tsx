import { useMemo, useState } from 'react';

const TableSwitcher = ({ tables }: { tables: any[] }) => {
  const [activeGraphName, setActiveGraphName] = useState(tables[0].name);

  const ActiveGraphComponent = useMemo(() => {
    const activeGraph = tables.find(
      (graph: { name: any }) => graph.name === activeGraphName
    );
    if (!activeGraph || !activeGraph.component) return null;

    const Component = activeGraph.component;
    const props = { ...activeGraph.props };

    return <Component {...props} />;
  }, [activeGraphName, tables]);

  return (
    <div className="flex flex-col gap-5 max-md:w-screen max-md:overflow-x-scroll">
      <div className="flex items-center gap-4">
        {tables.map(graph => (
          <button
            key={graph.name}
            className={`text-[16px] px-3 py-2 text-pink text-[16px] leading-[20px] font-[400] max-md:w-full hover:bg-blue-600 bg-gradient-to-l from-[#1694f1]/10 from-1% via-slate-800 via-40% to-[#e247fb]/10 to-90% transition-all ease-in duration-150`}
            onClick={() => setActiveGraphName(graph.name)}
          >
            {graph.name}
          </button>
        ))}
      </div>
      <div className="border border-slate-500 bg-transparent">
        {ActiveGraphComponent}
      </div>
    </div>
  );
};

export default TableSwitcher;
