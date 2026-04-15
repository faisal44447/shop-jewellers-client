import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ManageProducts = () => {
    const axiosSecure = useAxiosSecure();

    const { data: products = [], refetch } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await axiosSecure.get('/products');
            return res.data;
        }
    });

    const handleEdit = async (id) => {
        const newPrice = prompt("Enter new sell price");
        if (!newPrice) return;

        await axiosSecure.patch(`/products/${id}`, {
            sellPrice: parseFloat(newPrice)
        });

        Swal.fire("Updated!", "Price updated", "success");
        refetch();
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This product will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axiosSecure.delete(`/products/${id}`);
                Swal.fire("Deleted!", "Product removed", "success");
                refetch();
            }
        });
    };

    return (
        <div className="p-4">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map(p => (
                        <tr key={p._id}>
                            <td>{p.name}</td>
                            <td>{p.stock}</td>
                            <td>{p.sellPrice}</td>
                            <td className="space-x-2">
                                <button onClick={() => handleEdit(p._id)} className="btn btn-sm btn-info">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(p._id)} className="btn btn-sm btn-error">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageProducts;