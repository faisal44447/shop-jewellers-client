import { useQuery } from "@tanstack/react-query";
import ProductCard from "../ProductCard/ProductCard";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ProductCardPage = () => {
    const axiosSecure = useAxiosSecure();

    // ================= FETCH PRODUCTS =================
    const {
        data: products = [],
        isLoading,
        isError,
        refetch,
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
            <div className="flex justify-center items-center h-96">
                <span className="loading loading-spinner loading-lg text-orange-500"></span>
            </div>
        );
    }

    // ================= ERROR =================
    if (isError) {
        return (
            <p className="text-center text-red-500 mt-10">
                ❌ Failed to load products
            </p>
        );
    }

    return (
        <div className="p-5">

            {/* HEADER */}
            <h2 className="text-3xl font-bold mb-6 text-center text-orange-500">
                📦 All Products ({products.length})
            </h2>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                {products.length > 0 ? (
                    products.map((p) => (
                        <ProductCard
                            key={p._id}
                            product={p}
                            refetch={refetch}
                        />
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