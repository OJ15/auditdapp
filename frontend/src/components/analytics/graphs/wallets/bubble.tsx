'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Chart as ChartJS,
  Legend,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import * as d3 from 'd3-hierarchy';
import { useEffect, useState } from 'react';
import { Bubble } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

type Props = {
  data: any;
};

interface ChartData {
  datasets: {
    label: string;
    data: {
      x: number;
      y: number;
      r: number;
    }[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

const options = {
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
      beginAtZero: true,
    },
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        title: function (tooltipItems: any) {
          return tooltipItems[0].dataset.label;
        },
        label: function (tooltipItem: any) {
          return '';
        },
      },
    },
  },
};

const WalletBubble = (props: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData>({ datasets: [] });

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = props.data;

      let sortedData = fetchedData
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

      const root = d3
        .hierarchy({ children: sortedData } as any)
        .sum((d: any) => d.balance);

      const diameter = 300;
      const packLayout = d3.pack().size([diameter, diameter]).padding(50);

      const packedData = packLayout(root);

      const chartDataset = {
        datasets: root.leaves().map((node: any) => {
          const balance = parseFloat(node.data.balance);
          const bubbleRadius = node.r;

          let backgroundColor;
          let borderColor;

          if (balance >= percentile1) {
            backgroundColor = '#e247fb'; // Pinkish color
            borderColor = '#19181b'; // Black
          } else if (balance >= percentile5) {
            backgroundColor = '#c0f437'; // Greenish color
            borderColor = '#19181b'; // Black
          } else {
            backgroundColor = '#1694f1'; // Blue color
            borderColor = '#19181b'; // Black
          }

          return {
            label: node.data.addressLabel?.label || node.data.address,
            data: [
              {
                x: node.x - diameter / 2,
                y: node.y - diameter / 2,
                r: bubbleRadius,
              },
            ],
            backgroundColor,
            borderColor,
            borderWidth: 1, // Increased border width for visibility
          };
        }),
      };

      setChartData(chartDataset);
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return <Skeleton className="w-full h-[90%] bg-gradient-to-l from-[#1694f1]/10 from-1% via-slate-800 via-40% to-[#e247fb]/10 to-90%" loading={isLoading} />;
  }
  return (
    <div className="w-full h-[320px] bg-gradient-to-l from-[#1694f1]/10 from-1% via-slate-800 via-40% to-[#e247fb]/10 to-90%">
      <Bubble options={options} data={chartData} />
    </div>
  );
};

export default WalletBubble;
