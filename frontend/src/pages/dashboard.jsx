import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../libs/apiCall";
import Loading from "../components/loading";
import Info from "../components/info";
import Stats from "../components/stats";
import Chart from "../components/chart";
import DoughnutChart from "../components/piechart"; 

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardStats = async () => {
    const URL = "/transactions/summary";
    try {
      const { data } = await api.get(URL);
      setSummary(data.summary);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Something unexpected happened. Try again later."
      );

      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchDashboardStats();
  }, []);

  if (isLoading || !summary) {
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <Loading />
      </div>
    );
  }

  const totalIncome = parseFloat(summary.total_income);
  const totalExpense = parseFloat(summary.total_expense);
  const balance = totalIncome - totalExpense;

  return (
    <div className="px-0 md:px-5 2xl:px-20 p-20">
      <Info title="Dashboard" subTitle="Monitor your financial activities" />
      <Stats
        dt={{
          balance,
          income: totalIncome,
          expense: totalExpense,
        }}
      />
      <div className="flex flex-col-reverse items-center gap-10 w-full md:flex-row">
        <Chart data={{ income: totalIncome, expense: totalExpense }} />
        {totalIncome > 0 && (
          <DoughnutChart
            dt={{
              balance,
              income: totalIncome,
              expense: totalExpense,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
