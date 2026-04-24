import { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ProductCardPage = () => {
    const [products, setProducts] = useState([]);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        axiosSecure.get("/products")
            .then(res => {
                const stock = res.data.filter(p => p.status === "stock");
                setProducts(stock);
            });
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5">
            {products.map(p => (
                <ProductCard key={p._id} product={p} />
            ))}
        </div>
    );
};

export default ProductCardPage;