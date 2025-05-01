import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import DialogWrapper from './wrappers/dialog-wrapper';
import { DialogPanel, DialogTitle } from '@headlessui/react';
import Input from './input';
import { Button } from './buttons';
import api from "../libs/apiCall";
import { toast } from "sonner";
import { BiLoader } from "react-icons/bi";

const transactionCategories = ["money", "food", "transport"]; 

export const AddTransaction = ({ isOpen, setIsOpen, refetch }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [selectedCategory, setSelectedCategory] = useState(transactionCategories[0]);
    const [selectedType, setSelectedType] = useState("income"); 
    const [loading, setLoading] = useState(false);

    const onSubmit = async (formData) => {
        try {
            setLoading(true);

            const newTransaction = {
                amount: parseFloat(formData.amount),
                type: selectedType,
                category: selectedCategory,
                description: formData.description,
            };

            const { data: res } = await api.post(`/transactions`, newTransaction);
            console.log(res);
            if (res) {
                toast.success(res.message);
                setIsOpen(false);
                refetch();
            }
        } catch (error) {
            console.error("Something went wrong:", error);
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-300 mb-4 uppercase"
                >
                    Create Transaction
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Select Type */}
                    <div className="flex flex-col gap-1 mb-2">
                        <label className="text-gray-700 dark:text-gray-400 text-sm mb-2">
                            Select Type
                        </label>
                        <select
                            onChange={(e) => setSelectedType(e.target.value)}
                            value={selectedType}
                            className="bg-transparent border border-gray-300 dark:border-gray-700 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 outline-none focus:ring-1 focus:ring-violet-500"
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    {/* Select Category */}
                    <div className="flex flex-col gap-1 mb-2">
                        <label className="text-gray-700 dark:text-gray-400 text-sm mb-2">
                            Select Category
                        </label>
                        <select
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            value={selectedCategory}
                            className="bg-transparent border border-gray-300 dark:border-gray-700 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 outline-none focus:ring-1 focus:ring-violet-500"
                        >
                            {transactionCategories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Amount */}
                    <Input
                        type="number"
                        step="0.01"
                        name="amount"
                        label="Amount"
                        placeholder="4000.00"
                        {...register("amount", {
                            required: "Amount is required!",
                        })}
                        error={errors.amount?.message}
                    />

                    {/* Description */}
                    <Input
                        type="text"
                        name="description"
                        label="Description"
                        placeholder="e.g. savings"
                        {...register("description", {
                            required: "Description is required!",
                        })}
                        error={errors.description?.message}
                    />

                    <Button
                        disabled={loading}
                        type="submit"
                        className="bg-violet-700 text-white w-full mt-4"
                    >
                        {loading ? (
                            <BiLoader className="text-xl animate-spin text-white" />
                        ) : (
                            "Create Transaction"
                        )}
                    </Button>
                </form>
            </DialogPanel>
        </DialogWrapper>
    );
};
