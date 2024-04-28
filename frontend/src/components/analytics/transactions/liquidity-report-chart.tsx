'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { faker } from '@faker-js/faker';

import {
  Chart as ChartJS,
  Legend,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bubble } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

type Props = {
  type?: string;
};

export const options = {
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
  },
};

const generateRandomData = () => ({
  x: faker.datatype.number({ min: -10, max: 10 }),
  y: faker.datatype.number({ min: -10, max: 10 }),
  r: faker.datatype.number({ min: 5, max: 20 }),
});

const LiquidityReportData = {
  datasets: [
    {
      label: 'Liquidity Data',
      data: Array.from({ length: 30 }, generateRandomData),
      backgroundColor: 'rgba(37, 99, 235, 0.10)',
      borderColor: '#2563EB',
      borderWidth: 0.5,
    },
  ],
};

export const LiquidityReportChart = (props: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Made this timeout to show the skeleton loading will remove when api is ready
      setTimeout(() => setIsLoading(false), 1000);
    };

    loadData();
  }, []);

  return (
    <div className="w-full h-[320px]">
      {isLoading ? (
        <Skeleton className="w-full h-full" loading={isLoading} />
      ) : (
        <Bubble options={options} data={LiquidityReportData} />
      )}
    </div>
  );
};
