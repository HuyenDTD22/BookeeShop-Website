import LoginPage from "../pages/client/LoginPage";
import HomePage from "../pages/client/HomePage";
import RegisterPage from "../pages/client/RegisterPage";
import NotFoundPage from "../pages/client/NotFoundPage";
import ForgotPasswordPage from "../pages/client/ForgotPasswordPage";
import OTPVertificationPage from "../pages/client/OTPVertificationPage";
import LoginPageAdmin from "../pages/admin/LoginPageAdmin";
import DashboardPage from "../pages/admin/DashboardPage";
import ProductsPage from "../pages/admin/ProductsPage";
import CreateProductPage from "../pages/admin/CreateProductPage";
import ProductDetailPage from "../pages/admin/ProductDetailPage";

const ADMIN = process.env.REACT_APP_ADMIN;

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/user/login",
    page: LoginPage,
  },
  {
    path: "/user/register",
    page: RegisterPage,
  },
  {
    path: "/user/password/forgot",
    page: ForgotPasswordPage,
  },
  {
    path: "/user/password/opt",
    page: OTPVertificationPage,
  },

  //Admin
  {
    path: `/${ADMIN}/`,
    page: DashboardPage,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/auth/login`,
    page: LoginPageAdmin,
  },
  {
    path: `/${ADMIN}/book`,
    page: ProductsPage,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/book/create`,
    page: CreateProductPage,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/book/detail/:id`,
    page: ProductDetailPage,
    isAdmin: true,
  },

  {
    path: "*",
    page: NotFoundPage,
  },
];
