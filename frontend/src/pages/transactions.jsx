import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from "../libs/apiCall";
import Loading from "../components/loading";
import { toast } from "sonner";
import Title from '../components/title';
import { MdAdd } from 'react-icons/md';
import { AddTransaction } from '../components/add-transaction';

const Transactions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const type = searchParams.get("type") || "";
  const category = searchParams.get("category") || "";

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const fetchTransactions = async () => {
    try {
      const query = new URLSearchParams();
      if (type) query.append("type", type);
      if (category) query.append("category", category);
      const URL = `/transactions?${query.toString()}`;

      const { data: res } = await api.get(URL);
      setData(res?.transactions || []);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Something unexpected happened. Try again later."
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
    fetchTransactions();
  }, [type, category]);

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="w-full py-10">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <Title title="Transactions Activity" />

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="font-semibold">Type:</span>
              {["income", "expense", ""].map((val) => (
                <button
                  key={val || "all"}
                  onClick={() => handleFilterChange("type", val)}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-300 ${type === val || (!val && !type)
                      ? "bg-black text-white dark:bg-violet-700"
                      : "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                    }`}
                >
                  {val ? val.charAt(0).toUpperCase() + val.slice(1) : "All"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="font-semibold">Category:</span>
              {["money", "food", "transport", ""].map((val) => (
                <button
                  key={val || "all"}
                  onClick={() => handleFilterChange("category", val)}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-300 ${category === val || (!val && !category)
                      ? "bg-black text-white dark:bg-violet-700"
                      : "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                    }`}
                >
                  {val ? val.charAt(0).toUpperCase() + val.slice(1) : "All"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOpen(true)}
                className="py-2 px-4 rounded-md text-white bg-black hover:bg-violet-700 transition flex items-center justify-center gap-2 border text-sm font-medium"
              >
                <MdAdd size={22} />
                <span>Pay</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='overflow-x-auto mt-5'>
        {data?.length === 0 ? (
          <div className='w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-700 text-lg'>
            <span>No Transaction History</span>
          </div>
        ) : (
          <table className='w-full'>
            <thead className='border-b border-gray-300 dark:border-gray-700'>
              <tr className='text-black dark:text-gray-400 text-left'>
                <th className='py-2'>Date</th>
                <th className='py-2 px-2'>Description</th>
                <th className='py-2 px-2'>Type</th>
                <th className='py-2 px-2'>Category</th>
                <th className='py-2 px-2'>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className='text-gray-700 dark:text-gray-300'>
                  <td className='py-2'>{new Date(item.transaction_date).toLocaleDateString()}</td>
                  <td className='py-2 px-2'>{item.description}</td>
                  <td className='py-2 px-2'>{item.type}</td>
                  <td className='py-2 px-2'>{item.category}</td>
                  <td className='py-2 px-2'>${item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AddTransaction
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              refetch={fetchTransactions}
      />
    </>
  );
};

export default Transactions;
