import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Dashboard from "../Layout/Dashboard";

import Home from "../pages/Home/Home/Home";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

// USER
import UserHome from "../pages/Dashboard/UserHome/UserHome";
import Products from "../pages/Dashboard/Products/Products";
import Cart from "../pages/Dashboard/Cart/Cart";
import HowladList from "../pages/Dashboard/HowladNewa/HowladList";
import PaboTakaList from "../pages/Dashboard/PaboTaka/PaboTakaList";

// ADMIN
import AdminHome from "../pages/Dashboard/AdminHome/AdminHome";
import AddProduct from "../pages/Dashboard/AddProduct/AddProduct";
import ManageProduct from "../pages/Dashboard/ManageProduct/ManageProduct";
import Sales from "../pages/Dashboard/Sales/Sales";
import ExpenseList from "../pages/Dashboard/ExpenseList/ExpenseList";
import ProfitList from "../pages/Dashboard/AddProfit/ProfitList";
import StaffList from "../pages/Dashboard/StaffList/StaffList";
import AddStaff from "../pages/Dashboard/AddStaff/AddStaff";
import AddProfit from "../pages/Dashboard/AddProfit/AddProfit";
import HowladNewa from "../pages/Dashboard/HowladNewa/HowladNewa";
import PaboTaka from "../pages/Dashboard/PaboTaka/PaboTaka";

// OPTIONAL (error fix)
import ProductCardPage from "../pages/Dashboard/ProductCardPage/ProductCardPage";
import EditProduct from '../pages/Dashboard/EditProduct/EditProduct';
import Expenses from '../pages/Dashboard/Expenses/Expenses';
import EditStaff from "../pages/Dashboard/EditStaff/EditStaff";

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
            // ===== USER + ADMIN (COMMON) =====
            { index: true, element: <UserHome /> },
            { path: "userHome", element: <UserHome /> },
            { path: "products", element: <Products /> },
            { path: "cart", element: <Cart /> },
            { path: "howlad-list", element: <HowladList /> },
            { path: "paboTaka-list", element: <PaboTakaList /> },
            { path: "expenses", element: <Expenses /> },
            { path: "expenses-detailsToDo", element: <Expenses /> },

            // ✅ ERROR FIX ROUTE
            { path: "product-card-page", element: <ProductCardPage /> },

            // ===== ADMIN ONLY =====
            { path: "adminHome", element: <AdminRoute><AdminHome /></AdminRoute> },
            { path: "add-product", element: <AdminRoute><AddProduct /></AdminRoute> },
            { path: "manage-product", element: <AdminRoute><ManageProduct /></AdminRoute> },
            { path: "sales", element: <AdminRoute><Sales /></AdminRoute> },
            { path: "expense-list", element: <AdminRoute><ExpenseList /></AdminRoute> },
            { path: "profit-list", element: <AdminRoute><ProfitList /></AdminRoute> },
            { path: "add-profit", element: <AdminRoute><AddProfit /></AdminRoute> },
            { path: "staff-list", element: <AdminRoute><StaffList /></AdminRoute> },
            { path: "add-staff", element: <AdminRoute><AddStaff /></AdminRoute> },
            { path: "howlad-newa", element: <AdminRoute><HowladNewa /></AdminRoute> },
            { path: "paboTaka", element: <AdminRoute><PaboTaka /></AdminRoute> },
            {
                path: "/dashboard/edit/:id",
                element: <AdminRoute><EditProduct /></AdminRoute>,
            },
            {
                path: "/dashboard/edit-staff/:id",
                element: <EditStaff />
            },
        ],
    },
]);

export default router;

