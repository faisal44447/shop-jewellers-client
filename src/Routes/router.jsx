import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Dashboard from "../Layout/Dashboard";
import Home from "../pages/Home/Home/Home";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

// USER COMPONENTS
import UserHome from "../pages/Dashboard/UserHome/UserHome";
import Products from "../pages/Dashboard/Products/Products";
import Cart from "../pages/Dashboard/Cart/Cart";
import HowladList from "../pages/Dashboard/HowladNewa/HowladList";
import PaboTakaList from "../pages/Dashboard/PaboTaka/PaboTakaList";
import ProductCard from "../pages/Dashboard/ProductCard/ProductCard";
import ProductCardPage from "../pages/Dashboard/ProductCardPage/ProductCardPage";

// ADMIN COMPONENTS
import AdminHome from "../pages/Dashboard/AdminHome/AdminHome";
import AddProduct from "../pages/Dashboard/AddProduct/AddProduct";
import ManageProducts from "../pages/Dashboard/ManageProducts/ManageProducts";
import Sales from "../pages/Dashboard/Sales/Sales";
import ExpenseList from "../pages/Dashboard/ExpenseList/ExpenseList";
import Expenses from "../pages/Dashboard/Expenses/Expenses";
import ProfitList from "../pages/Dashboard/AddProfit/ProfitList";
import AddProfit from "../pages/Dashboard/AddProfit/AddProfit";
import StaffList from "../pages/Dashboard/StaffList/StaffList";
import AddStaff from "../pages/Dashboard/AddStaff/AddStaff";
import HowladNewa from "../pages/Dashboard/HowladNewa/HowladNewa";
import PaboTaka from "../pages/Dashboard/PaboTaka/PaboTaka";
import EditProduct from "../pages/Dashboard/EditProduct/EditProduct";
import EditStaff from "../pages/Dashboard/EditStaff/EditStaff";
import AllUsers from "../pages/Dashboard/AllUsers/AllUsers";
import SoldProducts from "../pages/Dashboard/SoldProducts/SoldProducts";
import AddCash from "../pages/Dashboard/AddCash/AddCash";
import CashList from "../pages/Dashboard/CashList/CashList";

// ⚠️ ড্যাশবোর্ড বা চার্ট ক্র্যাশ হলে সাদা স্ক্রিন আসা বন্ধ করার জন্য এরর কম্পোনেন্ট
const GlobalErrorPage = () => {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center p-6 text-center bg-white rounded-2xl shadow-sm border border-red-100 my-4">
      <div className="max-w-md">
        <span className="text-5xl">⚠️</span>
        <h1 className="text-xl font-bold text-gray-800 mt-4">কোথাও একটু ভুল হয়েছে!</h1>
        <p className="text-sm text-gray-500 mt-2">
          ড্যাশবোর্ডের ডাটা বা চার্ট প্রসেস করতে সাময়িক সমস্যা হচ্ছে। অনুগ্রহ করে পেজটি রিফ্রেশ দিন।
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
        >
          পেজ রিলোড দিন 🔄
        </button>
      </div>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <GlobalErrorPage />, // ১. গ্লোবাল রুট লেভেলে এরর হ্যান্ডেলার
    children: [
      { path: "/", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    errorElement: <GlobalErrorPage />, // ২. ড্যাশবোর্ড লেভেলে এরর হ্যান্ডেলার (চার্ট এরর রুখে দেবে)
    children: [
      // ================= USER ROUTES =================
      { index: true, element: <UserHome /> },
      { path: "userHome", element: <UserHome /> },
      { path: "products", element: <Products /> },
      { path: "product-card", element: <ProductCard /> },
      { path: "product-card-page", element: <ProductCardPage /> },
      { path: "sold-products", element: <SoldProducts /> },
      { path: "cash-list", element: <CashList /> },
      { path: "cart", element: <Cart /> },
      { path: "howlad-list", element: <HowladList /> },
      { path: "paboTaka-list", element: <PaboTakaList /> },
      { path: "expense-list", element: <ExpenseList /> },
      { path: "staff-list", element: <StaffList /> },
      { path: "profit-list", element: <ProfitList /> },

      // ================= ADMIN ONLY ROUTES =================
      { path: "adminHome", element: <AdminRoute><AdminHome /></AdminRoute> },
      { path: "all-users", element: <AdminRoute><AllUsers /></AdminRoute> },
      { path: "add-staff", element: <AdminRoute><AddStaff /></AdminRoute> },
      { path: "add-product", element: <AdminRoute><AddProduct /></AdminRoute> },
      { path: "manage-product", element: <AdminRoute><ManageProducts /></AdminRoute> },
      { path: "sales", element: <AdminRoute><Sales /></AdminRoute> },
      { path: "add-cash", element: <AdminRoute><AddCash /></AdminRoute> },
      { path: "expenses", element: <AdminRoute><Expenses /></AdminRoute> },
      { path: "add-profit", element: <AdminRoute><AddProfit /></AdminRoute> },
      { path: "howlad-newa", element: <AdminRoute><HowladNewa /></AdminRoute> },
      { path: "paboTaka", element: <AdminRoute><PaboTaka /></AdminRoute> },

      // EDIT ROUTES (ADMIN ONLY)
      { path: "edit/:id", element: <AdminRoute><EditProduct /></AdminRoute> },
      { path: "edit-staff/:id", element: <AdminRoute><EditStaff /></AdminRoute> },
    ],
  },
]);

export default router;