import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import {
  FaMoneyBillWave,
  FaStickyNote,
  FaCalendarAlt,
  FaPlus,
} from "react-icons/fa";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddProfit = () => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(false);

  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // ================= HANDLE ADD PROFIT =================
  const handleAddProfit = async (e) => {

    e.preventDefault();

    // ================= VALIDATION =================
    if (!amount || Number(amount) <= 0) {

      return Swal.fire({
        icon: "error",
        title: "Invalid Amount",
        text: "Please enter a valid profit amount",
      });

    }

    try {

      setLoading(true);

      const profitData = {
        amount: Number(amount),

        note: note || "",

        createdAt: dateTime
          ? new Date(dateTime)
          : new Date(),
      };

      // ================= SAVE PROFIT =================
      const res = await axiosSecure.post(
        "/profits",
        profitData
      );

      if (
        res?.data?.success ||
        res?.data?.insertedId ||
        res?.data?.acknowledged
      ) {

        Swal.fire({
          icon: "success",
          title: "Profit Added Successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        // RESET
        setAmount("");
        setNote("");
        setDateTime("");

        // NAVIGATE
        navigate("/dashboard/profit-list");

      } else {

        throw new Error(
          "Failed to add profit"
        );

      }

    } catch (err) {

      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          err?.message ||
          "Something went wrong",
      });

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white text-center">

          <h2 className="text-4xl font-bold">
            ➕ Add Profit
          </h2>

          <p className="mt-2 text-green-100">
            Track your business profit easily
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleAddProfit}
          className="p-8 space-y-6"
        >

          {/* AMOUNT */}
          <div>

            <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">

              <FaMoneyBillWave className="text-green-500" />

              Profit Amount

            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              placeholder="Enter profit amount"
              className="input input-bordered w-full focus:outline-none focus:border-green-500 text-black"
            />

          </div>

          {/* NOTE */}
          <div>

            <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">

              <FaStickyNote className="text-orange-500" />

              Note

            </label>

            <textarea
              value={note}
              onChange={(e) =>
                setNote(
                  e.target.value
                )
              }
              placeholder="Optional note..."
              className="textarea textarea-bordered w-full h-28 focus:outline-none focus:border-orange-500 text-black"
            />

          </div>

          {/* DATE TIME */}
          <div>

            <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">

              <FaCalendarAlt className="text-black" />

              Date & Time

            </label>

            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) =>
                setDateTime(
                  e.target.value
                )
              }
              className="input input-bordered w-full focus:outline-none focus:border-blue-500 text-black"
            />

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="btn w-full bg-green-500 hover:bg-green-600 text-white border-none text-lg"
          >

            {loading
              ? "Adding Profit..."
              : "Add Profit"}

            <FaPlus className="ml-2" />

          </button>

        </form>

      </div>

    </div>
  );
};

export default AddProfit;