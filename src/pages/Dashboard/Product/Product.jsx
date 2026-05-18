import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Product = () => {
    const axiosSecure = useAxiosSecure();

    // 🚀 ফিক্স: status ফিল্ডের পরিবর্তে stock > 0 ফিল্টার ব্যবহার করা হয়েছে
    const { data: stockProducts = [], isLoading } = useQuery({
        queryKey: ["stock-products"],
        queryFn: async () => {
            const res = await axiosSecure.get("/products");
            return Array.isArray(res.data) ? res.data.filter(p => safeStock(p?.stock) > 0) : [];
        }
    });

    // সেফ স্টক চেকার ইউটিলিটি
    const safeStock = (val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
    };

    if (isLoading) {
        return (
            <div className="p-5 flex justify-center items-center h-48">
                <span className="loading loading-spinner text-orange-500 loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-4 text-black">
                Stock Products ({stockProducts.length})
            </h2>
            {stockProducts.length === 0 ? (
                <p className="text-gray-500">No stock products found</p>
            ) : (
                <div className="space-y-2 bg-white p-4 rounded-xl shadow-inner max-w-md">
                    {stockProducts.map(p => (
                        <div key={p._id} className="flex justify-between items-center text-black font-medium border-b py-2 last:border-0">
                            <span>{p.name}</span>
                            <span className="badge badge-warning text-xs font-bold">Stock: {p.stock}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Product;