import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageProduct = () => {
    const [products, setProducts] = useState([]);
    const [paboList, setPaboList] = useState([]);
    const [tab, setTab] = useState("products");
    const [profits, setProfits] = useState([]);

    const axiosSecure = useAxiosSecure();

    // ================= PRODUCTS =================
    const fetchProducts = async () => {
        try {
            const res = await axiosSecure.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // ================= PABO =================
    const fetchPabo = async () => {
        try {
            const res = await axiosSecure.get("/receivables");
            setPaboList(res.data);
        } catch (err) {
            console.log(err);
        }
    };

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
    const handleDeleteProduct = (item) => {
        Swal.fire({
            title: "Delete Product?",
            text: "This will be removed!",
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
    const handleDeletePabo = (id) => {
        Swal.fire({
            title: "Delete?",
            text: "This will be removed!",
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
            html: `
                <input id="name" class="swal2-input" placeholder="Name" value="${item.name}">
                <input id="amount" class="swal2-input" placeholder="Amount" value="${item.amount}">
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    name: document.getElementById("name").value,
                    amount: document.getElementById("amount").value
                };
            }
        });

        if (formValues) {
            await axiosSecure.patch(`/receivables/${item._id}`, {
                name: formValues.name,
                amount: Number(formValues.amount)
            });

            fetchPabo();

            Swal.fire("Updated!", "Data updated successfully", "success");
        }
    };

    return (
        <div className="p-5 mt-10">
            <div className="mb-5">
                <h2 className="text-3xl text-center font-bold">Manage Products</h2>

            </div>
            {/* 🔥 TAB BUTTON */}
            <div className="flex gap-3 mb-5 flex-wrap">
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

                <Link to="/expenses-list">
                    <button className="btn btn-info">📋 Expenses</button>
                </Link>

                <button
                    onClick={() => setTab("profit")}
                    className={`btn ${tab === "profit" ? "btn-primary" : ""}`}
                >
                    💸 Profit
                </button>
            </div>

            {/* ================= PRODUCTS TABLE ================= */}
            {tab === "products" && (
                <>
                    <div className="flex justify-between mb-6 flex-wrap gap-3">
                        <div className="flex gap-3 flex-wrap">
                            <Link to="/expenses">
                                <button className="btn btn-accent">➕ Expenses</button>
                            </Link>
                            <Link to="/add-product">
                                <button className="btn btn-primary">➕ Add Product</button>
                            </Link>

                            <Link to="/howlad">
                                <button className="btn btn-secondary">➕ Howlad</button>
                            </Link>

                            <Link to="/paboTaka">
                                <button className="btn btn-accent">➕ Pabo Tk</button>
                            </Link>

                            <div className="mb-4 text-center">
                                <Link to="/add-profit">
                                    <button className="btn btn-success">
                                        ➕ Add Profit
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

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
                                {products.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>

                                        <td>
                                            <img
                                                src={item.image || "https://picsum.photos/200"}
                                                className="w-12 h-12 object-cover rounded"
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
                                                <Link to={`/edit/${item._id}`}>
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
                </>
            )}

            {/* ================= PABO TABLE ================= */}
            {tab === "pabo" && (
                <>
                    <h2 className="text-3xl font-bold mb-5">
                        💰 Manage Pabo Taka
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paboList.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>৳ {item.amount}</td>

                                        <td>
                                            {item.createdAt
                                                ? new Date(item.createdAt).toLocaleString()
                                                : "No date"}
                                        </td>

                                        <td>
                                            <div className="flex gap-2">
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
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default ManageProduct;