//client
import LoginPage from "../pages/client/auth/LoginPage";
import HomePage from "../pages/client/home/HomePage";
import RegisterPage from "../pages/client/auth/RegisterPage";
import NotFoundPage from "../pages/client/auth/NotFoundPage";
import ForgotPasswordPage from "../pages/client/auth/ForgotPasswordPage";
import OTPVertificationPage from "../pages/client/auth/OTPVertificationPage";
import BookDetailPage from "../pages/client/product/BookDetailPage";

//admin
import LoginPageAdmin from "../pages/admin/auth/LoginPageAdmin";
import DashboardPage from "../pages/admin/dashboard/DashboardPage";
import ProductsPage from "../pages/admin/product/ProductsPage";
import CreateProductPage from "../pages/admin/product/CreateProductPage";
import ProductDetailPage from "../pages/admin/product/ProductDetailPage";
import EditProductPage from "../pages/admin/product/EditProductPage";
import CategoryPage from "../pages/admin/category/CategoryPage";
import CreateCategoryPage from "../pages/admin/category/CreateCategoryPage";
import EditCategoryPage from "../pages/admin/category/EditCategoryPage";
import RolePage from "../pages/admin/role/RolePage";
import CreateRolePage from "../pages/admin/role/CreateRolePage";
import EditRolePage from "../pages/admin/role/EditRolePage";
import PermissionsPage from "../pages/admin/role/PermissionsPage";
import AccountPage from "../pages/admin/account/AccountPage";
import CreateAccountPage from "../pages/admin/account/CreateAccountPage";
import EditAccountPage from "../pages/admin/account/EditAccountPage";
import AccountDetailPage from "../pages/admin/account/AccountDetailPage";

const ADMIN = process.env.REACT_APP_ADMIN;

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/book/detail/:slugBook",
    page: BookDetailPage,
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
  //Product - Danh sách sản phẩm
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
    path: `/${ADMIN}/book/edit/:id`,
    page: EditProductPage,
    isAdmin: true,
  },
  //category - Danh mục sản phẩm
  {
    path: `/${ADMIN}/category`,
    page: CategoryPage,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/category/create`,
    page: CreateCategoryPage,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/category/edit/:id`,
    page: EditCategoryPage,
    isAdmin: true,
  },
  //Role - Nhóm quyền
  {
    path: `/${ADMIN}/role`,
    page: RolePage,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/role/create`,
    page: CreateRolePage,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/role/edit/:id`,
    page: EditRolePage,
    isAdmin: true,
  },
  //Permissions - Phân quyền
  {
    path: `/${ADMIN}/role/permissions`,
    page: PermissionsPage,
    isAdmin: true,
  },

  //Account - Tài khoản
  {
    path: `/${ADMIN}/account`,
    page: AccountPage,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/account/create`,
    page: CreateAccountPage,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/account/detail/:id`,
    page: AccountDetailPage,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/account/edit/:id`,
    page: EditAccountPage,
    isAdmin: true,
  },

  {
    path: "*",
    page: NotFoundPage,
  },
];
