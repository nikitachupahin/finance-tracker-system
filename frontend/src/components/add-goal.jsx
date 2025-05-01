import React, { useState } from 'react';
import useStore from "../store";
import { useForm } from 'react-hook-form';
import DialogWrapper from './wrappers/dialog-wrapper';
import { DialogPanel, DialogTitle } from '@headlessui/react';
import Input from './input';
import { Button } from './buttons';
import api from "../libs/apiCall";
import { toast } from "sonner";
import { BiLoader } from "react-icons/bi";

const goalCategories = ["Car", "Home", "Education", "Vacation", "Savings"];

export const AddGoal = ({ isOpen, setIsOpen, refetch }) => {
    const { user } = useStore((state) => state);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [selectedGoal, setSelectedGoal] = useState(goalCategories[0]);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (formData) => {
        try {
            setLoading(true);

            const newGoal = {
                goal_name: selectedGoal,
                target_amount: parseFloat(formData.target_amount),
                current_amount: parseFloat(formData.current_amount),
                deadline: formData.deadline,
            };

            const { data: res } = await api.post(`/goals`, newGoal);
            console.log(res)
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
                    Create Goal
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col gap-1 mb-2">
                        <label className="text-gray-700 dark:text-gray-400 text-sm mb-2">
                            Select Goal Category
                        </label>
                        <select
                            onChange={(e) => setSelectedGoal(e.target.value)}
                            className="bg-transparent border border-gray-300 dark:border-gray-700 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 outline-none focus:ring-1 focus:ring-violet-500"
                        >
                            {goalCategories.map((goal, index) => (
                                <option
                                    key={index}
                                    value={goal}
                                    className="dark:bg-slate-900"
                                >
                                    {goal}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Input
                        type="number"
                        step="0.01"
                        name="target_amount"
                        label="Target Amount"
                        placeholder="5000.00"
                        {...register("target_amount", {
                            required: "Target amount is required!",
                        })}
                        error={errors.target_amount?.message}
                    />

                    <Input
                        type="number"
                        step="0.01"
                        name="current_amount"
                        label="Current Amount"
                        placeholder="0.00"
                        {...register("current_amount", {
                            required: "Current amount is required!",
                        })}
                        error={errors.current_amount?.message}
                    />

                    <Input
                        type="date"
                        name="deadline"
                        label="Deadline"
                        {...register("deadline", {
                            required: "Deadline is required!",
                        })}
                        error={errors.deadline?.message}
                    />

                    <Button
                        disabled={loading}
                        type="submit"
                        className="bg-violet-700 text-white w-full mt-4"
                    >
                        {loading ? (
                            <BiLoader className="text-xl animate-spin text-white" />
                        ) : (
                            "Create Goal"
                        )}
                    </Button>
                </form>
            </DialogPanel>
        </DialogWrapper>
    );
};
