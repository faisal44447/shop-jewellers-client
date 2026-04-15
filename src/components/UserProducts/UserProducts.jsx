import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const UserProducts = () => {
    const axiosSecure = useAxiosSecure();

    const { data: products = [] } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await axiosSecure.get('/products');
            return res.data;
        }
    });

    return (
        <div className="grid grid-cols-3 gap-4">
            {products.map(p => (
                <div key={p._id} className="p-4 shadow rounded">
                    <h3 className="font-bold">{p.name}</h3>
                    <p>Price: {p.sellPrice}</p>
                    <p>Stock: {p.stock}</p>
                </div>
            ))}
        </div>
    );
};

export default UserProducts;