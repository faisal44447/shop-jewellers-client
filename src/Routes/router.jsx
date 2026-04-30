import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Dashboard from "../Layout/Dashboard";

import Home from "../pages/Home/Home/Home";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";

import UserHome from "../pages/Dashboard/UserHome/UserHome";
import AdminHome from "../pages/Dashboard/AdminHome/AdminHome";
import AddProduct from "../pages/Dashboard/AddProduct/AddProduct";
import ManageProduct from "../pages/Dashboard/ManageProduct/ManageProduct";
import Products from "../pages/Dashboard/Products/Products";
import Cart from "../pages/Dashboard/Cart/Cart";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

import Expenses from "../pages/Dashboard/Expenses/Expenses";
import ExpensesDetailsToDo from "../pages/Dashboard/Expenses/ExpensesDetailsToDo";
import ExpenseList from "../pages/Dashboard/ExpenseList/ExpenseList";

import EditStaff from "../pages/Dashboard/EditStaff/EditStaff";
import HowladList from "../pages/Dashboard/HowladNewa/HowladList";
import HowladNewa from "../pages/Dashboard/HowladNewa/HowladNewa";

import PaboTaka from "../pages/Dashboard/PaboTaka/PaboTaka";
import PaboTakaList from "../pages/Dashboard/PaboTaka/PaboTakaList";

import ProductCard from "../pages/Dashboard/ProductCard/ProductCard";
import ProductCardPage from "../pages/Dashboard/ProductCardPage/ProductCardPage";

import SellProduct from "../pages/Dashboard/SellProduct/SellProduct";
import Sales from "../pages/Dashboard/Sales/Sales";

import StaffList from "../pages/Dashboard/StaffList/StaffList";
import StaffSalaryCard from "../pages/Dashboard/StaffSalaryCard/StaffSalaryCard";

import AddProfit from "../pages/Dashboard/AddProfit/AddProfit";
import ProfitList from '../pages/Dashboard/AddProfit/ProfitList';
import AddStaff from "../pages/Dashboard/AddStaff/AddStaff";

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
            { index: true, element: <UserHome /> },

            // USER
            { path: "userHome", element: <UserHome /> },
            { path: "products", element: <Products /> },
            { path: "product-card-page", element: <ProductCardPage /> },
            { path: "cart", element: <Cart /> },

            { path: "expenses", element: <Expenses /> },
            { path: "expense-details", element: <ExpensesDetailsToDo /> },

            { path: "howlad-newa", element: <HowladNewa /> },
            { path: "paboTaka", element: <PaboTaka /> },

            { path: "product-card", element: <ProductCard /> },
            { path: "sell-product", element: <SellProduct /> },

            // ADMIN
            { path: "adminHome", element: <AdminRoute><AdminHome /></AdminRoute> },
            { path: "add-product", element: <AdminRoute><AddProduct /></AdminRoute> },
            { path: "manage-product", element: <AdminRoute><ManageProduct /></AdminRoute> },

            { path: "expense-list", element: <AdminRoute><ExpenseList /></AdminRoute> },
            { path: "howlad-list", element: <AdminRoute><HowladList /></AdminRoute> },
            { path: "add-staff", element: <AdminRoute><AddStaff /></AdminRoute> },

            { path: "paboTaka-list", element: <AdminRoute><PaboTakaList /></AdminRoute> },

            { path: "sales", element: <AdminRoute><Sales /></AdminRoute> },
            { path: "staff-list", element: <AdminRoute><StaffList /></AdminRoute> },

            { path: "edit-staff", element: <AdminRoute><EditStaff /></AdminRoute> },

            { path: "add-profit", element: <AdminRoute><AddProfit /></AdminRoute> },
            { path: "profit-list", element: <AdminRoute><ProfitList /></AdminRoute> },
        ],
    },
]);

export default router;
