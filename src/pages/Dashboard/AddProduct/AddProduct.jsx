import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AddProduct = () => {
    const axiosSecure = useAxiosSecure();

    const [form, setForm] = useState({
        name: "",
        category: "",
        stock: "",
        buyPrice: "",
        sellPrice: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            ...form,
            stock: parseInt(form.stock),
            buyPrice: parseFloat(form.buyPrice),
            sellPrice: parseFloat(form.sellPrice)
        };

        try {
            const res = await axiosSecure.post('/products', productData);

            if (res.data.insertedId) {
                Swal.fire({
                    icon: "success",
                    title: "Product Added!",
                    text: "Your product has been saved successfully",
                    timer: 2000,
                    showConfirmButton: false
                });

                setForm({
                    name: "",
                    category: "",
                    stock: "",
                    buyPrice: "",
                    sellPrice: ""
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Failed!",
                text: "Product not added"
            });
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 shadow rounded">

            <h2 className="text-2xl font-bold mb-4">Add Product</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                />

                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                />

                <input
                    type="number"
                    name="buyPrice"
                    placeholder="Buy Price"
                    value={form.buyPrice}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                />

                <input
                    type="number"
                    name="sellPrice"
                    placeholder="Sell Price"
                    value={form.sellPrice}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                />

                <button
                    type="submit"
                    className="btn btn-warning w-full"
                >
                    Add Product
                </button>

            </form>
        </div>
    );
};

export default AddProduct;