import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Products = () => {
    const [products, setProducts] = useState([]);
    const axiosSecure = useAxiosSecure();

    const fetchProducts = async () => {
        try {
            const res = await axiosSecure.get("/products");
            setProducts(res.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [axiosSecure]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Product will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/products/${id}`);

                    if (res.data.deletedCount > 0 || res.data.success) {
                        fetchProducts();

                        Swal.fire({
                            title: "Deleted!",
                            text: "Product deleted successfully.",
                            icon: "success"
                        });
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        });
    };

    return (
        <div className="mt-10">

            <div className="flex justify-evenly mb-8">
                <h2 className="text-4xl text-center font-bold">
                    All Products: {products.length}
                </h2>
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
                            <th>Buy</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((item, index) => (
                            <tr key={item._id}>
                                <th>{index + 1}</th>

                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            <img src={item.image} alt="product" />
                                        </div>
                                    </div>
                                </td>

                                <td>{item.name}</td>
                                <td>{item.karat}</td>

                                <td>
                                    {item.vori}ভরি {item.ana}আনা {item.rati}রতি {item.point}পয়েন্ট
                                </td>

                                <td>৳{item.buyPrice}</td>

                                <td>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="btn btn-sm btn-error text-white"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
};

export default Products;