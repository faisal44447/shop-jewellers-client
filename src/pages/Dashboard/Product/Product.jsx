import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Product = () => {
    const [products, setProducts] = useState([]);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        axiosSecure.get("/products")
            .then(res => {
                const stock = res.data.filter(p => p.status === "stock");
                setProducts(stock);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="p-5">
            <h2>Products</h2>
            {products.map(p => <p key={p._id}>{p.name}</p>)}
        </div>
    );
};

export default Product;