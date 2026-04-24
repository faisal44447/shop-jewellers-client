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
            { path: "userHome", element: <UserHome /> },
            { path: "products", element: <Products /> },
            { path: "cart", element: <Cart /> },

            // ADMIN ONLY
            { path: "adminHome", element: <AdminRoute><AdminHome /></AdminRoute> },
            { path: "add-product", element: <AdminRoute><AddProduct /></AdminRoute> },
            { path: "manage-product", element: <AdminRoute><ManageProduct /></AdminRoute> },
        ],
    },
]);

export default router;
