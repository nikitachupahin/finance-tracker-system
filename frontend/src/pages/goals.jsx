import React, { useState, useEffect } from "react";
import useStore from "../store";
import { FaCar, FaHome, FaGraduationCap, FaPlane, FaPiggyBank } from "react-icons/fa";
import api from "../libs/apiCall";
import Loading from "../components/loading";
import { toast } from "sonner";
import Title from "../components/title";
import { MdAdd } from "react-icons/md";
import { formatCurrency } from "../libs";
import { AddGoal } from "../components/add-goal";

const ICONS = {
  car: (
    <div className='w-12 h-12 bg-red-600 text-white flex items-center justify-center rounded-full shadow'>
      <FaCar size={26} />
    </div>
  ),
  home: (
    <div className='w-12 h-12 bg-indigo-600 text-white flex items-center justify-center rounded-full shadow'>
      <FaHome size={26} />
    </div>
  ),
  education: (
    <div className='w-12 h-12 bg-emerald-600 text-white flex items-center justify-center rounded-full shadow'>
      <FaGraduationCap size={26} />
    </div>
  ),
  vacation: (
    <div className='w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full shadow'>
      <FaPlane size={26} />
    </div>
  ),
  savings: (
    <div className='w-12 h-12 bg-yellow-500 text-white flex items-center justify-center rounded-full shadow'>
      <FaPiggyBank size={26} />
    </div>
  ),
};

const Goals = () => {
  const { user } = useStore((state) => state);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const { data: res } = await api.get(`/goals`);
      setData(res?.goals || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to load goals");
      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="w-full py-10">
        <div className='flex items-center justify-between'>
          <Title title='Your Financial Goals' />
          <button
            onClick={() => setIsOpen(true)}
            className='py-1.5 px-3 rounded bg-black text-white flex items-center gap-2 hover:bg-violet-700 transition'
          >
            <MdAdd size={22} />
            <span>Add Goal</span>
          </button>
        </div>

        {data.length === 0 ? (
          <div className="w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-400 text-lg">
            <span>No goals found yet. Start by adding one!</span>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 py-10 gap-6">
            {data.map((goal, index) => (
              <div
                key={index}
                className="w-full min-h-[14rem] flex flex-col bg-gradient-to-br from-white to-gray-100 dark:from-slate-800 dark:to-slate-900 p-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">
                      {ICONS[goal.goal_name?.toLowerCase()] || ICONS.savings}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {goal.goal_name}
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      goal.status === "completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                        : goal.status === "in_progress"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {goal.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 flex-grow">
                  <p><span className="font-medium">🎯 Target:</span> {formatCurrency(goal.target_amount)}</p>
                  <p><span className="font-medium">📅 Created:</span> {new Date(goal.created_at).toLocaleDateString("en-US", { dateStyle: "full" })}</p>
                  <p><span className="font-medium">⏳ Deadline:</span> {new Date(goal.deadline).toLocaleDateString("en-US", { dateStyle: "full" })}</p>
                  <p className="text-base font-semibold text-violet-700 dark:text-violet-400">
                    💰 Current: {formatCurrency(goal.current_amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddGoal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refetch={fetchGoals}
      />
    </>
  );
};

export default Goals;
