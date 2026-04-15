import { useQuery } from '@tanstack/react-query';
import { FaBook, FaDollarSign, FaUsers } from 'react-icons/fa';
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    PieChart,
    Pie,
    Legend,
    ResponsiveContainer
} from 'recharts';

import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // ✅ Admin stats
    const { data: stats = {} } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin-stats');
            return res.data;
        }
    });

    // ✅ Order stats (chart data)
    const { data: chartData = [], isLoading } = useQuery({
        queryKey: ['order-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/order-stats');
            return res.data;
        }
    });

    // ✅ Pie chart data
    const pieChartData = chartData.map(data => ({
        name: data._id,
        value: data.revenue
    }));

    // ✅ Loading handle
    if (isLoading) {
        return <p className="text-center mt-10">Loading charts...</p>;
    }

    return (
        <div>
            <h2 className="text-3xl mb-5">
                <span>Hi, Welcome </span>
                {user?.displayName ? user.displayName : 'Back'}
            </h2>

            {/* ✅ Stats */}
            <div className="stats shadow mb-10">

                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <FaDollarSign className='text-3xl' />
                    </div>
                    <div className="stat-title">Revenue</div>
                    <div className="stat-value">${stats.revenue || 0}</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <FaUsers className='text-3xl' />
                    </div>
                    <div className="stat-title">Users</div>
                    <div className="stat-value">{stats.users || 0}</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <FaBook className='text-3xl' />
                    </div>
                    <div className="stat-title">Menu Items</div>
                    <div className="stat-value">{stats.menuItems || 0}</div>
                </div>

                <div className="stat">
                    <div className="stat-title">Orders</div>
                    <div className="stat-value">{stats.orders || 0}</div>
                </div>

            </div>

            {/* ✅ Charts */}
            <div className="flex flex-col md:flex-row gap-10">

                {/* 🔵 Bar Chart */}
                <div className="w-full md:w-1/2 h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Bar dataKey="quantity">
                                {
                                    chartData.map((entry, index) => (
                                        <Cell key={index} fill={colors[index % colors.length]} />
                                    ))
                                }
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* 🟢 Pie Chart */}
                <div className="w-full md:w-1/2 h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {
                                    pieChartData.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))
                                }
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
};

export default AdminHome;