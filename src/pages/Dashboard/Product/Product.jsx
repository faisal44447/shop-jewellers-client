import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const res = await axiosSecure.get("/products");

                const stockProducts = Array.isArray(res.data)
                    ? res.data.filter(p => p?.status?.toLowerCase() === "stock")
                    : [];

                setProducts(stockProducts);

            } catch (err) {
                console.log(err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [axiosSecure]);

    if (loading) {
        return (
            <div className="p-5">
                <span className="loading loading-spinner"></span>
            </div>
        );
    }

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">
                Products ({products.length})
            </h2>

            {products.length === 0 ? (
                <p>No stock products found</p>
            ) : (
                products.map(p => (
                    <p key={p._id}>{p.name}</p>
                ))
            )}
        </div>
    );
};

export default Product;