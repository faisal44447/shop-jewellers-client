import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Invoice = ({ sale }) => {

    const download = () => {
        const input = document.getElementById("invoice");

        html2canvas(input).then(canvas => {
            const img = canvas.toDataURL("image/png");
            const pdf = new jsPDF();

            pdf.addImage(img, "PNG", 10, 10, 180, 160);
            pdf.save(`invoice-${sale._id}.pdf`);
        });
    };

    return (
        <div>
            <button onClick={download} className="btn btn-success">
                Invoice PDF
            </button>

            <div id="invoice" className="p-5 bg-white hidden">
                <h2>ERP INVOICE</h2>
                <p>Product: {sale.name}</p>
                <p>Qty: {sale.quantity}</p>
                <p>Total: ৳{sale.total}</p>
                <p>Profit: ৳{sale.profit}</p>
            </div>
        </div>
    );
};

export default Invoice; 