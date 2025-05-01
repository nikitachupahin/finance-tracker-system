import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Title from "./title";

const Chart = ({ data }) => {
  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

  const singleMonthData = [
    {
      label: currentMonth,
      income: data?.income || 0,
      expense: data?.expense || 0,
    },
  ];

  return (
    <div className="flex-1 w-full">
      <Title title="Transaction Activity (Current Month)" />
      <ResponsiveContainer width="100%" height={400} className="mt-5">
        <LineChart width={500} height={300} data={singleMonthData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="expense" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
