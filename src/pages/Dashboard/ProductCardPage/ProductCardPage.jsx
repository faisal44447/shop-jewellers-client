import { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ProductCardPage = () => {
    const [products, setProducts] = useState([]);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        axiosSecure.get("/products")
            .then(res => {
                // ✅ SAFE FIX (no empty issue)
                setProducts(res.data || []);
            })
            .catch(err => {
                console.log(err);
                setProducts([]);
            });
    }, [axiosSecure]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5">
            {products.length > 0 ? (
                products.map(p => (
                    <ProductCard key={p._id} product={p} />
                ))
            ) : (
                <p className="text-center col-span-3 text-gray-500">
                    No products found
                </p>
            )}
        </div>
    );
};

export default ProductCardPage;