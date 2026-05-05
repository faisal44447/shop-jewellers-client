// src/pages/Dashboard/DashboardAnalytics.jsx
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const DashboardAnalytics = () => {
    const axiosSecure = useAxiosSecure();
    const [data, setData] = useState([]);

    useEffect(() => {
        axiosSecure.get("/analytics/daily")
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    }, [axiosSecure]);

    return (
        <div>
            <h2>Analytics Data</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default DashboardAnalytics;