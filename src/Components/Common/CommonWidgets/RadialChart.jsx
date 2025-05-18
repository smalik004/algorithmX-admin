import React from "react";
//
import { RadialProgressChart } from "../../../Data/Social/Chart";

const RadialChart = ({ chartData }) => {
  const updatedOption = {
    ...RadialProgressChart,
    series: chartData.series,
    options: {
      ...RadialProgressChart.options,
      chart: {
        dropShadow: {
          ...RadialProgressChart.options.chart.dropShadow,
          color: [...chartData.color],
        },
      },
      colors: chartData.color,
    },
  };
  return (
    <> 
    </>
  );
};

export default RadialChart;
