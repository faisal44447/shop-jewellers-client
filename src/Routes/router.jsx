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
import ProductCard from "../pages/Dashboard/ProductCard/ProductCard";
import ProductCardPage from "../pages/Dashboard/ProductCardPage/ProductCardPage";
import SellProduct from "../pages/Dashboard/SellProduct/SellProduct";

// ADMIN
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
      // USER
      { index: true, element: <UserHome /> },
      { path: "userHome", element: <UserHome /> },

      { path: "products", element: <Products /> },
      { path: "product-card", element: <ProductCard /> },
      { path: "product-card-page", element: <ProductCardPage /> },

      // ✅ SELL PAGE (IMPORTANT FIX)
      { path: "sell", element: <SellProduct /> },

      { path: "cart", element: <Cart /> },
      { path: "howlad-list", element: <HowladList /> },
      { path: "paboTaka-list", element: <PaboTakaList /> },

      // ADMIN
      { path: "adminHome", element: <AdminHome /> },
      { path: "add-product", element: <AddProduct /> },
      { path: "manage-product", element: <ManageProducts /> },
      { path: "sales", element: <Sales /> },

      { path: "expenses", element: <Expenses /> },
      { path: "expense-list", element: <ExpenseList /> },

      { path: "profit-list", element: <ProfitList /> },
      { path: "add-profit", element: <AddProfit /> },

      { path: "staff-list", element: <StaffList /> },
      { path: "add-staff", element: <AddStaff /> },

      { path: "howlad-newa", element: <HowladNewa /> },
      { path: "paboTaka", element: <PaboTaka /> },

      // EDIT
      { path: "edit/:id", element: <AdminRoute><EditProduct /></AdminRoute> },
      { path: "edit-staff/:id", element: <AdminRoute><EditStaff /></AdminRoute> },
    ],
  },
]);

export default router;

