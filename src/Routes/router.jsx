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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
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
    children: [
      // ================= USER ROUTES =================
      // এই পেজগুলো সাধারণ ইউজার এবং অ্যাডমিন সবাই দেখতে পারবে
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
      // এই পেজগুলোতে অ্যাডমিন ছাড়া অন্য কেউ ঢুকলে AdminRoute তাকে আটকে দেবে
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