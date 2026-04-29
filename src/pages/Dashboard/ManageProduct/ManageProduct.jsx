import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageProduct = () => {
    const [products, setProducts] = useState([]);
    const [paboList, setPaboList] = useState([]);
    const [profits, setProfits] = useState([]);
    const [tab, setTab] = useState("products");

    const axiosSecure = useAxiosSecure();

    // ================= FETCH PRODUCTS =================
    const fetchProducts = async () => {
        try {
            const res = await axiosSecure.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // ================= FETCH PABO =================
    const fetchPabo = async () => {
        try {
            const res = await axiosSecure.get("/receivables");
            setPaboList(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // ================= FETCH PROFITS =================
    const fetchProfits = async () => {
        try {
            const res = await axiosSecure.get("/profits");
            setProfits(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchPabo();
        fetchProfits();
    }, []);

    // ================= DELETE PRODUCT =================
    const handleDeleteProduct = async (item) => {
        Swal.fire({
            title: "Delete Product?",
            text: "This cannot be undone!",
            icon: "warning",
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axiosSecure.delete(`/products/${item._id}`);
                fetchProducts();
                Swal.fire("Deleted!", "Product removed", "success");
            }
        });
    };

    // ================= DELETE PABO =================
    const handleDeletePabo = async (id) => {
        Swal.fire({
            title: "Delete?",
            icon: "warning",
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axiosSecure.delete(`/receivables/${id}`);
                fetchPabo();
                Swal.fire("Deleted!", "Removed successfully", "success");
            }
        });
    };

    // ================= EDIT PABO =================
    const handleEditPabo = async (item) => {
        const { value: formValues } = await Swal.fire({
            title: "Edit Pabo",
            html:
                `<input id="name" class="swal2-input" value="${item.name}" placeholder="Name">` +
                `<input id="amount" class="swal2-input" value="${item.amount}" placeholder="Amount">`,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    name: document.getElementById("name").value,
                    amount: Number(document.getElementById("amount").value)
                };
            }
        });

        if (formValues) {
            await axiosSecure.patch(`/receivables/${item._id}`, formValues);
            fetchPabo();
            Swal.fire("Updated!", "Pabo updated", "success");
        }
    };

    return (
        <div className="p-5 mt-10">

            <h2 className="text-3xl font-bold text-center mb-5">
                Manage System
            </h2>

            {/* ================= TAB BUTTONS ================= */}
            <div className="flex gap-3 mb-6 flex-wrap">

                <button
                    onClick={() => setTab("products")}
                    className={`btn ${tab === "products" ? "btn-primary" : ""}`}
                >
                    📦 Products
                </button>

                <button
                    onClick={() => setTab("pabo")}
                    className={`btn ${tab === "pabo" ? "btn-primary" : ""}`}
                >
                    💰 Pabo Taka
                </button>

                <button
                    onClick={() => setTab("profit")}
                    className={`btn ${tab === "profit" ? "btn-primary" : ""}`}
                >
                    💸 Profit
                </button>

                {/* FIXED ROUTES */}
                <Link to="/dashboard/expenses">
                    <button className="btn btn-info">
                        📋 Expenses
                    </button>
                </Link>

                <Link to="/dashboard/add-product">
                    <button className="btn btn-success">
                        ➕ Add Product
                    </button>
                </Link>

                <Link to="/dashboard/add-profit">
                    <button className="btn btn-warning">
                        ➕ Add Profit
                    </button>
                </Link>
            </div>

            {/* ================= PRODUCTS ================= */}
            {tab === "products" && (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Karat</th>
                                <th>Weight</th>
                                <th>Buy Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((item, i) => (
                                <tr key={item._id}>
                                    <td>{i + 1}</td>

                                    <td>
                                        <img
                                            src={item.image || "https://picsum.photos/200"}
                                            className="w-12 h-12 rounded object-cover"
                                        />
                                    </td>

                                    <td>{item.name}</td>
                                    <td>{item.karat}</td>
                                    <td>
                                        {item.vori}v {item.ana}a {item.rati}r {item.point}p
                                    </td>
                                    <td>৳{item.buyPrice}</td>

                                    <td>
                                        <div className="flex gap-2">
                                            <Link to={`/dashboard/edit/${item._id}`}>
                                                <button className="btn btn-warning btn-xs">
                                                    <FaEdit />
                                                </button>
                                            </Link>

                                            <button
                                                onClick={() => handleDeleteProduct(item)}
                                                className="btn btn-error btn-xs"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ================= PABO ================= */}
            {tab === "pabo" && (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paboList.map((item, i) => (
                                <tr key={item._id}>
                                    <td>{i + 1}</td>
                                    <td>{item.name}</td>
                                    <td>৳{item.amount}</td>

                                    <td className="flex gap-2">
                                        <button
                                            onClick={() => handleEditPabo(item)}
                                            className="btn btn-warning btn-xs"
                                        >
                                            <FaEdit />
                                        </button>

                                        <button
                                            onClick={() => handleDeletePabo(item._id)}
                                            className="btn btn-error btn-xs"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ================= PROFIT ================= */}
            {tab === "profit" && (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {profits.map((item, i) => (
                                <tr key={item._id}>
                                    <td>{i + 1}</td>
                                    <td>{item.title}</td>
                                    <td>৳{item.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageProduct;