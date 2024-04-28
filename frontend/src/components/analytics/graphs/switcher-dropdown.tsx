import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger
} from '@/components/ui/select';
import { useMemo, useState } from 'react';

const DropdownSwitcher = ({
  graphs,
  defaultResolution,
}: {
  graphs: any[];
  defaultResolution: string;
}) => {
  const [activeGraphName, setActiveGraphName] = useState(graphs[0].name);
  const [resolution, setResolution] = useState(defaultResolution);

  const resolutionFilter = ['6M', '1M', '1W', '1D'];

  const ActiveGraphComponent = useMemo(() => {
    const activeGraph = graphs.find(
      (graph: { name: any }) => graph.name === activeGraphName
    );
    if (!activeGraph || !activeGraph.component) return null;

    const Component = activeGraph.component;
    const props = activeGraph.props || {};

    return <Component {...props} />;
  }, [activeGraphName, graphs]);

  const handleResolutionChange = (value: string) => {
    setResolution(value);
  };

  return (
    <div className="flex flex-col p-3 border border-zinc-900 bg-gradient-to-l from-[#1694f1]/10 from-1% via-slate-800/10 via-40% to-[#e247fb]/10 to-90% h-[386px]">
      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-4 absolute translate-y-5">
          <Select onValueChange={value => setActiveGraphName(value)}>
            <SelectTrigger className="bg-gradient-to-l from-[#1694f1]/10 from-1% via-slate-800 via-40% to-[#e247fb]/10 to-90% rounded-[4px] outline-none p-2 py-1 text-white">
              {activeGraphName}
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 text-white pointer rounded-[4px] overflow-auto">
              <SelectGroup>
                {graphs.map((graph, i) => (
                  <SelectItem
                    key={i}
                    className="p-2 pl-3 outline-none cursor-pointer hover:bg-zinc-800"
                    value={graph.name}
                  >
                    {graph.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {ActiveGraphComponent}
    </div>
  );
};

export default DropdownSwitcher;
