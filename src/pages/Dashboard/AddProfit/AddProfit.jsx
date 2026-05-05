import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddProfit = () => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [dateTime, setDateTime] = useState("");
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleAddProfit = async () => {
    if (!amount || Number(amount) <= 0) {
      return Swal.fire("Error", "Valid amount required", "error");
    }

    try {
      const data = {
        amount: Number(amount),
        note: note || "",
        createdAt: dateTime ? new Date(dateTime) : new Date(),
      };

      const res = await axiosSecure.post("/profits", data);

      if (res.data.success) {
        Swal.fire("Success", "Profit added", "success");
        setAmount("");
        setNote("");
        setDateTime("");
        navigate("/dashboard/profit-list");
      }
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Failed", "error");
    }
  };

  return (
    <div className="p-5 mt-10 max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-5">➕ Add Profit</h2>

      <div className="mb-4">
        <label className="block font-bold mb-2">Amount</label>
        <input
          type="number"
          className="input input-bordered w-full"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter profit amount"
        />
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-2">Note</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note"
        />
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-2">Date & Time</label>
        <input
          type="datetime-local"
          className="input input-bordered w-full"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />
      </div>

      <button
        className="btn btn-success w-full"
        onClick={handleAddProfit}
      >
        Add Profit
      </button>
    </div>
  );
};

export default AddProfit;