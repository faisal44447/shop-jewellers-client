import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const HowladList = () => {
    const [list, setList] = useState([]);
    const axiosSecure = useAxiosSecure();

    const fetchData = async () => {
        const res = await axiosSecure.get("/transactions");
        setList(res.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">📊 Howlad Details</h2>

            <table className="table table-xs">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Date & Time</th>
                    </tr>
                </thead>

                <tbody>
                    {list.map((item, i) => (
                        <tr key={item._id}>
                            <td>{i + 1}</td>
                            <td>{item.name}</td>
                            <td>
                                {item.type === "loan"
                                    ? "➕ Howlad Nise"
                                    : "➖ Howlad Dise"}
                            </td>
                            <td
                                className={`font-bold ${item.type === "loan" ? "text-green-600" : "text-red-500"
                                    }`}
                            >
                                {item.type === "loan" ? "+" : "-"}৳ {item.amount}                            </td>
                            <td>
                                {item.createdAt
                                    ? (() => {
                                        const d = new Date(item.createdAt);
                                        const day = d.getDate().toString().padStart(2, "0");
                                        const month = (d.getMonth() + 1).toString().padStart(2, "0");
                                        const year = d.getFullYear();

                                        let hours = d.getHours();
                                        const minutes = d.getMinutes().toString().padStart(2, "0");
                                        const ampm = hours >= 12 ? "PM" : "AM";
                                        hours = hours % 12 || 12; // 0 হলে 12

                                        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
                                    })()
                                    : item.date
                                        ? (() => {
                                            const d = new Date(item.date);
                                            const day = d.getDate().toString().padStart(2, "0");
                                            const month = (d.getMonth() + 1).toString().padStart(2, "0");
                                            const year = d.getFullYear();
                                            let hours = d.getHours();
                                            const minutes = d.getMinutes().toString().padStart(2, "0");
                                            const ampm = hours >= 12 ? "PM" : "AM";
                                            hours = hours % 12 || 12;
                                            return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
                                        })()
                                        : "No Date"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HowladList;