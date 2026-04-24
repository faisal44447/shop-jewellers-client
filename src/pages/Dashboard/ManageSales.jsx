import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ManageSales = () => {
    const axiosSecure = useAxiosSecure();

    const { data: sales = [] } = useQuery({
        queryKey: ['sales'],
        queryFn: async () => {
            const res = await axiosSecure.get('/sales');
            return res.data;
        }
    });

    return (
        <div className="p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Sales History</h2>

            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    {sales.map((s, i) => (
                        <tr key={i}>
                            <td>{s.productId}</td>
                            <td>{s.quantity}</td>
                            <td>{s.total}</td>
                            <td>{new Date(s.date).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageSales;