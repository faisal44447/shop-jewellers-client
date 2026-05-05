export const formatDateTime = (dateStr) => {
    if (!dateStr) return { date: "N/A", time: "N/A" };

    const d = new Date(dateStr);

    if (isNaN(d)) return { date: "Invalid", time: "Invalid" };

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return {
        date: `${day}/${month}/${year}`,
        time: `${hours}:${minutes} ${ampm}`,
    };
};