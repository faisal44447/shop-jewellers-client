import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const UserProducts = () => {
    const axiosSecure = useAxiosSecure();

    // ================= FETCH PRODUCTS =================
    const {
        data: products = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await axiosSecure.get("/products");

            return Array.isArray(res.data)
                ? res.data
                : [];
        },
    });

    // ================= LOADING =================
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-60">
                <span className="loading loading-spinner loading-lg text-orange-500"></span>
            </div>
        );
    }

    // ================= ERROR =================
    if (isError) {
        return (
            <div className="text-center py-10">
                <h2 className="text-red-500 text-xl font-bold">
                    ❌ Failed to load products
                </h2>
            </div>
        );
    }

    // ================= EMPTY =================
    if (products.length === 0) {
        return (
            <div className="text-center py-10">
                <h2 className="text-gray-500 text-xl font-semibold">
                    No Products Available
                </h2>
            </div>
        );
    }

    return (
        <div>

            {/* TITLE */}
            <div className="mb-6">

                <h2 className="text-3xl font-bold text-orange-500">
                    🛍️ Product Collection
                </h2>

                <p className="text-gray-500 mt-1">
                    Browse all available jewellery products
                </p>

            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {products.map((product) => (

                    <div
                        key={product._id}
                        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 border"
                    >

                        {/* PRODUCT IMAGE */}
                        <div className="h-56 overflow-hidden">

                            <img
                                src={
                                    product?.image ||
                                    "https://i.ibb.co/4pDNDk1/no-image.png"
                                }
                                alt={product?.name}
                                className="w-full h-full object-cover hover:scale-105 transition duration-300"
                            />

                        </div>

                        {/* PRODUCT INFO */}
                        <div className="p-5">

                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {product?.name}
                            </h3>

                            <div className="space-y-2 text-sm text-gray-600">

                                <p>
                                    💰 Price:{" "}
                                    <span className="font-semibold text-green-600">
                                        ৳{product?.sellPrice}
                                    </span>
                                </p>

                                <p>
                                    📦 Stock:{" "}
                                    <span className="font-semibold">
                                        {product?.stock}
                                    </span>
                                </p>

                                {product?.category && (
                                    <p>
                                        🏷️ Category:{" "}
                                        <span className="font-medium">
                                            {product?.category}
                                        </span>
                                    </p>
                                )}

                            </div>

                            {/* BUTTON */}
                            <button className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl font-semibold transition duration-300">

                                View Details

                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default UserProducts;