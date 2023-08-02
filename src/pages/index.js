import moment from "moment";
import React from "react";
import ReactApexChart from "react-apexcharts";

const AdRevenueCalculation = ({ data }) => {
  const calculateProfitLoss = (revenue, cogs, adsCost) => {
    const totalRevenue = parseFloat(revenue);
    const totalCOGS = parseFloat(cogs);
    const totalAdsCost = parseFloat(adsCost);

    const grossProfit = totalRevenue - totalCOGS;
    const netProfit = grossProfit - totalAdsCost;

    return {
      grossProfit,
      netProfit,
    };
  };

  return (
    <>
      <ReactApexChart
        series={[
          {
            name: "Gross Profit (This Year)",
            data: data.map((item) =>
              parseFloat(
                calculateProfitLoss(item.revenue, item.cogs, item.ads_cost)
                  ?.grossProfit
              ).toFixed(2)
            ),
          },
          {
            name: "Net Profit (This Year)",
            data: data.map((item) =>
              parseFloat(
                calculateProfitLoss(item.revenue, item.cogs, item.ads_cost)
                  ?.netProfit
              ).toFixed(2)
            ),
          },
          {
            name: "Gross Profit (Last Year)",
            data: data.map((item) =>
              parseFloat(
                calculateProfitLoss(
                  item.revenue_lastyear,
                  item.cogs_lastyear,
                  item.ads_cost_lastyear
                )?.grossProfit
              ).toFixed(2)
            ),
          },
          {
            name: "Net Profit (Last Year)",
            data: data.map((item) =>
              parseFloat(
                calculateProfitLoss(
                  item.revenue_lastyear,
                  item.cogs_lastyear,
                  item.ads_cost_lastyear
                )?.grossProfit
              ).toFixed(2)
            ),
          },
        ]}
        options={{
          plotOptions: {
            bar: {
              borderRadius: 5,
              borderRadiusApplication: "end",
              borderRadiusWhenStacked: "last",
            },
          },
          stroke: {
            curve: "smooth",
          },

          xaxis: {
            categories: data.map((item) =>
              moment(item.date).format("DD MMM, YYYY")
            ),
            type: "date",
          },
          chart: {
            height: 350,
            type: "bar",
          },
        }}
        height={364}
        type="bar"
      />
    </>
  );
};

export default AdRevenueCalculation;
