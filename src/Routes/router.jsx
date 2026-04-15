import { createBrowserRouter } from "react-router-dom";
import Main from '../Layout/Main';
import Home from '../pages/Home/Home/Home';
import Login from '../pages/Login/Login';
import SignUp from '../pages/SignUp/SignUp';
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Layout/Dashboard";
import UserHome from "../pages/Dashboard/UserHome/UserHome";
import AdminRoute from "./AdminRoute";
import AdminHome from "../pages/Dashboard/AdminHome/AdminHome";
import AllUsers from "../pages/Dashboard/AllUsers/AllUsers";
import AddProduct from "../pages/Dashboard/AddProduct/AddProduct";
import SellProduct from "../pages/Dashboard/SellProduct/SellProduct";
import ManageSales from "../pages/Dashboard/ManageSales";
import ManageProducts from "../pages/Dashboard/ManageProducts/ManageProducts";


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
    path: "dashboard",
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
    children: [

      // user
      { path: "userHome", element: <UserHome /> },
      { path: "sell-product", element: <SellProduct /> },
      { path: "history", element: <ManageSales /> },

      // admin
      { path: "adminHome", element: <AdminRoute><AdminHome /></AdminRoute> },
      { path: "add-product", element: <AdminRoute><AddProduct /></AdminRoute> },
      { path: "manage-products", element: <AdminRoute><ManageProducts /></AdminRoute> },
      { path: "all-users", element: <AdminRoute><AllUsers /></AdminRoute> },
      { path: "sales", element: <AdminRoute><ManageSales /></AdminRoute> },

    ],
  },
]);

export default router;