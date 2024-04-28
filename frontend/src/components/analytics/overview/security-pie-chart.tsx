import dynamic from 'next/dynamic';
import React from 'react';
import { Props } from 'react-apexcharts';
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
}) as React.FC<Props>;

type props = {
  value: number;
  height?: number;
  labels?: boolean;
};
const PieGraph = (props: props) => {
  const series = [props.value];

  const options: Props['options'] = {
    chart: {
      width: 200,
      height: 200,
      type: 'radialBar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: '70%',
          background: 'pink-800',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
            color: '#1694f1',
          },
        },
        track: {
          background: '#19181b',
          strokeWidth: '100%',
          margin: 0,
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },
        dataLabels: {
          value: {
            formatter: function (val: any) {
              return (props.labels ? `${val}%` : `${val}/100`) || '';
            },
            color: '#FAFAFA',
            fontSize: '30px',
            fontWeight: 600,
            show: true,
            offsetY: props.labels ? -20 : 0,
          },
          show: true,
          name: {
            offsetY: 30,
            show: props.labels,
            color: '#fff',
            fontWeight: 400,
            fontSize: '14px',
          },
        },
      },
    },
    fill: {
      colors: ['#c0f437'],
      opacity: 0.9,
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#c0f437'],
        inverseColors: false,
        stops: [0, 50, 100],
        opacityFrom: [0.2, 0.8],
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Overall Safety'],
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: 380,
          },
        },
      },
    ],
  };

  return (
    <div id="card" className="bg-transparent p-0 m-0">
      <div id="chart">
        <Chart
          options={options}
          series={series}
          type="radialBar"
          height={props.height}
          width={'100%'}
        />
      </div>
    </div>
  );
};

export default PieGraph;
