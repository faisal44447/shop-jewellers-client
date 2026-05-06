import { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ProductCardPage = () => {
    const [products, setProducts] = useState([]);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        axiosSecure.get("/products")
            .then(res => {
                setProducts(res.data || []);
            })
            .catch(err => {
                console.log(err);
                setProducts([]);
            });
    }, [axiosSecure]);

    return (
        <div className="p-5">

            {/* HEADER (outside grid) */}
            <h2 className="text-3xl font-bold mb-6 text-center">
                All Products ({products.length})
            </h2>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

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

        </div>
    );
};

export default ProductCardPage;