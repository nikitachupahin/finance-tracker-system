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

// Массив месяцев по умолчанию
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Функция для заполнения пустых месяцев нулями
const fillMissingMonths = (data = []) => {
  return months.map((month) => {
    const found = data.find((d) => d.label === month);
    return found || { label: month, income: 0, expense: 0 };
  });
};

export const Chart = ({ data }) => {
  const filledData = fillMissingMonths(data);

  return (
    <div className="flex-1 w-full">
      <Title title="Transaction Activity" />
      <ResponsiveContainer width="100%" height={500} className="mt-5">
        <LineChart width={500} height={300} data={filledData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" padding={{ left: 30, right: 30 }} />
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
