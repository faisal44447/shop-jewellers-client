import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useState } from 'react';
import Swal from "sweetalert2";

const SellProduct = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // load products
    const { data: products = [] } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await axiosSecure.get('/products');
            return res.data;
        }
    });

    // handle sell
    const handleSell = async () => {
        if (!selectedProduct || quantity <= 0) return;

        const saleData = {
            productId: selectedProduct._id,
            quantity: parseInt(quantity),
            sellPrice: selectedProduct.sellPrice
        };

        try {
            const res = await axiosSecure.post('/sales', saleData);

            if (res.data.insertedId) {
                Swal.fire({
                    icon: "success",
                    title: "Sold Successfully!",
                    text: `${selectedProduct.name} sold`,
                    timer: 2000,
                    showConfirmButton: false
                });

                setQuantity(1);
                setSelectedProduct(null);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Sell Failed!",
                text: "Check stock or server error"
            });
        }
    };

    return (
        <div className="grid grid-cols-2 gap-6">

            {/* Product List */}
            <div className="bg-white p-4 shadow rounded">
                <h2 className="text-xl font-bold mb-3">Products</h2>

                {products.map(p => (
                    <div
                        key={p._id}
                        className="border p-2 mb-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => setSelectedProduct(p)}
                    >
                        <h3>{p.name}</h3>
                        <p>Stock: {p.stock}</p>
                        <p>Price: {p.sellPrice}</p>
                    </div>
                ))}
            </div>

            {/* Sell Panel */}
            <div className="bg-white p-4 shadow rounded">

                <h2 className="text-xl font-bold mb-3">Sell Product</h2>

                {selectedProduct ? (
                    <>
                        <p><b>Product:</b> {selectedProduct.name}</p>
                        <p><b>Stock:</b> {selectedProduct.stock}</p>

                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="input input-bordered w-full my-3"
                            placeholder="Quantity"
                        />

                        <button
                            onClick={handleSell}
                            className="btn btn-success w-full"
                        >
                            Confirm Sell
                        </button>
                    </>
                ) : (
                    <p className="text-gray-500">Select a product to sell</p>
                )}

            </div>

        </div>
    );
};

export default SellProduct;