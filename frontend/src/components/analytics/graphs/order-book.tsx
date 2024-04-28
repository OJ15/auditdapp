import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import qs from 'qs';
import React, { useEffect, useState } from 'react';

function formatSubscript(value: number) {
  if (value == null) return null;


  let valueStr = value.toFixed(20);
  const match = valueStr.match(/0\.(0*)[1-9]/);
  if (match && match[1]) {
    const numberOfZeros = match[1].length;
    const nonZeroPart = valueStr.substring(
      valueStr.indexOf(match[1]) + numberOfZeros
    );
    return `0.0<sub>${numberOfZeros}</sub>${nonZeroPart}`;
  }
  return value.toFixed(2);
}

interface Book {
  bids: { p0: number; qty: number }[];
  asks: { p0: number; qty: number }[];
  price: number;
}

interface SeriesData {
  books: Book[];
}

const OrderBookGraph: React.FC<{
  pair: string;
  exchange: string;
  labels?: string[];
  priceUsd: number;
}> = ({ pair, exchange, labels, priceUsd }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const processSeriesData = (data: SeriesData) => {
    const bids = data.books
      .flatMap((book: { bids: any }) => book.bids)
      .sort((a: { p0: number }, b: { p0: number }) => b.p0 - a.p0)
      .reduce((acc: any[][], bid: { p0: any; qty: any }) => {

        const lastQty = acc.length > 0 ? acc[acc.length - 1][1] : 0;
        acc.push([bid.p0, bid.qty + lastQty]);
        return acc;
      }, []);

    const asks = data.books
      .flatMap((book: { asks: any }) => book.asks)
      .sort((a: { p0: number }, b: { p0: number }) => a.p0 - b.p0)
      .reduce((acc: any[][], ask: { p0: any; qty: any }) => {
        const lastQty = acc.length > 0 ? acc[acc.length - 1][1] : 0;
        acc.push([ask.p0, ask.qty + lastQty]);
        return acc;
      }, []);

    bids.reverse();

    const price = data.books[0].price;

    return { bids, asks, price };
  };

  useEffect(() => {
    setLoading(true);

    let pool = exchange;
    if (labels && labels.length > 0) {
      pool += `-${labels[0]}`;
    }

    const loadData = async () => {
      const queryString = qs.stringify({
        type: 'orders',
        address: pair,
        exchange: pool,
      });
      const response = await axios.get(`/api/analytics?${queryString}`);

      const { bids, asks, price } = processSeriesData(response.data);

      setData({
        chart: {
          type: 'area',
          zoomType: 'xy',
          height: '320px',
          backgroundColor: 'rgba(0, 0, 0, 0)',
        },
        title: {
          text: null,
        },
        xAxis: {
          minPadding: 0,
          maxPadding: 0,
          plotLines: [
            {
              color: '#c0f437',
              value: price,
              width: 1,
              dashStyle: 'dash',
              label: {
                text: 'Actual price',
                rotation: 90,
                style: {
                  color: '#fff', 
                }

              },
            },
          ],
          labels: {
            formatter: function (this: { value?: number | null }) {
              if (this.value != null) {
                let formattedValue = parseFloat(this.value.toFixed(2));
                formattedValue = parseFloat((formattedValue * priceUsd).toFixed(2));
                const formattedString = formatSubscript(formattedValue);
                return '$ ' + formattedString;
              }
              return null;
            },
            style: {
              fontSize: '14px',
              fontWeight: 400,
              // color: '#',
              color: '#c0f437', // Primary text color

            },
          },
          title: {
            text: null,
          },
          tickWidth: 0,
          minorTickLength: 0,
        },
        yAxis: [
          {
            lineWidth: 0,
            gridLineWidth: 0,
            title: null,
            tickWidth: 0,
            minorTickLength: 0,
            tickLength: 0,
            tickPosition: 'inside',
            labels: {
              align: 'left',
              x: 8,
              enabled: false,
              formatter: function (this: { value?: number | null }) {
                if (this.value != null) {
                  let formattedValue = parseFloat(this.value.toFixed(2));
                  formattedValue = parseFloat((formattedValue * priceUsd).toFixed(2));
                  const formattedString = formatSubscript(formattedValue);
                  return '$ ' + formattedString;
                }
                return null;
              },
              style: {
                fontSize: '12px',
                fontWeight: 400,
                color: '#c0f437',
              },
            },
          },
          {
            opposite: true,
            linkedTo: 0,
            lineWidth: 0,
            gridLineWidth: 0,
            title: null,
            tickWidth: 0,
            minorTickLength: 0,
            tickLength: 5,
            tickPosition: 'inside',
            labels: {
              align: 'right',
              x: 8,
              style: {
                fontSize: '12px',
                fontWeight: 400,
                // color: '#D4D4D4',
                color: '#c0f437', // Primary text color

              },
            },
          },
        ],
        legend: {
          enabled: false,
        },
        plotOptions: {
          area: {
            fillOpacity: 0.2,
            lineWidth: 1,
            step: 'center',
          },
        },
        tooltip: {
          headerFormat: '<span style="font-size=10px;">Price: {point.key}</span><br/>',
          valueDecimals: 2,
        },
        credits: {
          enabled: false,
        },
        series: [
          {
            name: 'Bids',
            data: bids,
            color: '#c0f437', // Primary accent color

          },
          {
            name: 'Asks',
            data: asks,
            color: '#e247fb', // Secondary accent color
          },
        ],
      });

      setLoading(false);
    };

    loadData();
  }, [pair]);

  if (isLoading) {
    return (
      <Skeleton className="w-[100%] h-[320px] aspect-landscape translate-y-12 bg-gradient-to-l from-[#1694f1]/10 from-1% via-slate-800 via-40% to-[#e247fb]/10 to-90%" loading={isLoading} />
    );
  }

  return (
    <div className="w-full translate-y-12 bg-gradient-to-l from-[#1694f1]/10 from-1% via-slate-800 via-40% to-[#e247fb]/10 to-90%">
      <HighchartsReact highcharts={Highcharts} options={data} />
    </div>
  );
};

export default OrderBookGraph;
