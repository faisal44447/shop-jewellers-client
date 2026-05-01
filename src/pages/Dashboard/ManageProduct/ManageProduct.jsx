import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageProduct = () => {
    const [products, setProducts] = useState([]);
    const [paboList, setPaboList] = useState([]);
    const [profits, setProfits] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [tab, setTab] = useState("products");

    const axiosSecure = useAxiosSecure();

    // ================= FETCH =================
    const fetchProducts = async () => {
        const res = await axiosSecure.get("/products");
        setProducts(res.data || []);
    };

    const fetchPabo = async () => {
        const res = await axiosSecure.get("/receivables");
        setPaboList(res.data || []);
    };

    const fetchProfits = async () => {
        const res = await axiosSecure.get("/profits");
        setProfits(res.data || []);
    };

    const fetchExpenses = async () => {
        const res = await axiosSecure.get("/expenses");
        setExpenses(res.data || []);
    };

    const fetchStaffs = async () => {
        const res = await axiosSecure.get("/staffs");
        setStaffs(res.data || []);
    };

    useEffect(() => {
        fetchProducts();
        fetchPabo();
        fetchProfits();
        fetchExpenses();
        fetchStaffs();
    }, []);

    // ================= DELETE =================
    const handleDelete = (url, id, refresh) => {
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`${url}/${id}`).then(() => {
                    refresh();
                    Swal.fire("Deleted!", "", "success");
                });
            }
        });
    };

    return (
        <div className="p-5 mt-10">

            <h2 className="text-3xl font-bold text-center mb-5">
                Manage System
            </h2>

            {/* ================= TABS ================= */}
            <div className="flex gap-3 mb-6 flex-wrap">

                <button onClick={() => setTab("products")} className={`btn ${tab === "products" && "btn-primary"}`}>
                    📦 Products
                </button>

                <button onClick={() => setTab("pabo")} className={`btn ${tab === "pabo" && "btn-primary"}`}>
                    💰 Pabo
                </button>

                <Link to="/dashboard/add-product" className="btn btn-success">➕ Product</Link>
                <Link to="/dashboard/add-profit" className="btn btn-warning">➕ Profit</Link>
                <Link to="/dashboard/add-staff" className="btn btn-info">➕ Staff</Link>
                <Link to="/dashboard/expenses" className="btn btn-error">➕ Expense</Link>

            </div>

            {/* ================= PRODUCTS ================= */}
            {tab === "products" && (
                <table className="table w-full">
                    <tbody>
                        {products.map((item, i) => (
                            <tr key={item._id}>
                                <td>{i + 1}</td>
                                <td>{item.name}</td>
                                <td>৳{item.buyPrice}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* ================= PABO ================= */}
            {tab === "pabo" && (
                <table className="table w-full">
                    <tbody>
                        {paboList.map((item, i) => (
                            <tr key={item._id}>
                                <td>{i + 1}</td>
                                <td>{item.name}</td>
                                <td>৳{item.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* ================= PROFIT ================= */}
            {tab === "profit" && (
                <table className="table w-full">
                    <tbody>
                        {profits.map((item, i) => (
                            <tr key={item._id}>
                                <td>{i + 1}</td>
                                <td>{item.note}</td>
                                <td>৳{item.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* ================= EXPENSES ================= */}
            {tab === "expenses" && (
                <table className="table w-full">
                    <tbody>
                        {expenses.map((item, i) => (
                            <tr key={item._id}>
                                <td>{i + 1}</td>
                                <td>{item.title}</td>
                                <td>৳{item.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* ================= STAFF ================= */}
            {tab === "staff" && (
                <table className="table w-full">
                    <tbody>
                        {staffs.map((item, i) => (
                            <tr key={item._id}>
                                <td>{i + 1}</td>
                                <td>{item.name}</td>
                                <td>৳{item.monthlySalary}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    );
};

export default ManageProduct;