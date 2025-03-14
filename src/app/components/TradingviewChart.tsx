import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

const TradingViewChart = ({ initialData, liveData }: any) => {
  const chartContainerRef = useRef<any>(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef<any>(null);
  const [chartData, setChartData] = useState<any>([]);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setChartData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const chart: any = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        // backgroundColor: "#ffffff",
        textColor: "#000000",
      },
      grid: {
        vertLines: {
          color: "#eeeeee",
        },
        horzLines: {
          color: "#eeeeee",
        },
      },
    //   priceScale: {
    //     borderColor: "#cccccc",
    //   },
      timeScale: {
        borderColor: "#cccccc",
        timeVisible: true,
        secondsVisible: true,
        rightOffset: 5,
      },
    });

    // Add the candle series with a custom price format
    const candleSeries = chart?.addCandlestickSeries({
      upColor: "green",
      downColor: "red",
      borderVisible: false,
      wickUpColor: "green",
      wickDownColor: "red",
      priceFormat: {
        type: "price",
        precision: 12, // Number of decimal places to display
        minMove: 0.000000000001, // Smallest price movement
      },
    });

    // Store references
    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    // Add initial data to the series
    if (chartData && chartData.length > 0) {
      candleSeries.setData(chartData);
    }

    // Cleanup on unmount
    return () => {
      chart.remove();
    };
  }, [chartData]);


  //////////////////
  // useEffect(() => {
  //   if (liveData?.length > 0) {
  //     setChartData((prevData) => {
  //       const lastClose = prevData.length > 0 ? prevData[prevData.length - 1].close : null;

  //       // Create a new live data array with unique transactions (if same timestamp, index them)
  //       const updatedLiveData = liveData.map((item, index) => {
  //         if (index === 0 && lastClose !== null) {
  //           // First live data, set 'open' as the last 'close' value
  //           return { ...item, open: lastClose };
  //         } else if (index > 0) {
  //           // Subsequent live data, set 'open' to the previous 'close'
  //           return { ...item, open: liveData[index - 1].close };
  //         }
  //         return item;
  //       });

  //       // Handle duplicate timestamps by adding an incrementing index to each item
  //       const handleDuplicates = (updatedData) => {
  //         const result = [];
  //         let lastTimestamp = null;
  //         let duplicateIndex = 0;

  //         updatedData.forEach(item => {
  //           if (lastTimestamp === item.time) {
  //             // If same timestamp, increment the duplicateIndex to differentiate
  //             result.push({ ...item, time: item.time + '.' + duplicateIndex });
  //             duplicateIndex++;
  //           } else {
  //             result.push(item);
  //             lastTimestamp = item.time;
  //             duplicateIndex = 0; // Reset for new timestamps
  //           }
  //         });
  //         return result;
  //       };

  //       const finalUpdatedData = handleDuplicates(updatedLiveData);

  //       // Combine previous data with the updated live data
  //       return [...prevData, ...finalUpdatedData];
  //     });
  //   }
  // }, [liveData]);

  // Update chart with live data
  useEffect(() => {
    if (liveData?.length > 0) {
      setChartData((prevData: any) => {
        const lastClose = prevData.length > 0 ? prevData[prevData.length - 1].close : null;

        // Transform the liveData to set 'open' based on the last 'close' of the previous data
        const updatedLiveData = liveData.map((item: any, index: number) => {
          if (index === 0 && lastClose !== null) {
            return { ...item, open: lastClose };
          } else if (index > 0) {
            return { ...item, open: liveData[index - 1].close };
          }
          return item;
        });
        return [...prevData, ...updatedLiveData];
      });
    }
  }, [liveData]);

  useEffect(() => {
    if (candleSeriesRef?.current) {
      candleSeriesRef?.current?.setData(chartData);
    }
  }, [chartData, liveData]);

  return (
    <div
      ref={chartContainerRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
    />
  );
};

export default TradingViewChart;