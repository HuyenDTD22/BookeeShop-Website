/* Client */
import LoginPage from "../pages/client/auth/LoginPage";
import HomePage from "../pages/client/home/HomePage";
import RegisterPage from "../pages/client/auth/RegisterPage";
import NotFoundPage from "../pages/client/auth/NotFoundPage";
import ForgotPasswordPage from "../pages/client/auth/ForgotPasswordPage";
import OTPVertificationPage from "../pages/client/auth/OTPVertificationPage";
import BookDetailPage from "../pages/client/product/BookDetailPage";
import CategoryBooksPage from "../pages/client/category/CategoryBooksPage";
import FeaturedBooksPage from "../pages/client/product/FeaturedBooksPage";
import NewBooksPage from "../pages/client/product/NewBooksPage";
import OrderPage from "../pages/client/order/OrderPage";
import CartPage from "../pages/client/cart/CartPage";
import MyAccountPage from "../pages/client/user/MyAccountPage";
import NotificationsPage from "../pages/client/notification/NotificationsPage";
/* Admin */
import LoginPageAdmin from "../pages/admin/auth/LoginPageAdmin";
import ForgotPasswordPageAdmin from "../pages/admin/auth/ForgotPasswordPageAdmin";
import VerifyOtpPageAdmin from "../pages/admin/auth/VerifyOtpPageAdmin";
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
import MyAccountPageAdmin from "../pages/admin/account/MyAccountPage";
import OrderPageAdmin from "../pages/admin/order/OrderPage";
import UserPage from "../pages/admin/user/UserPage";
import ReviewPage from "../pages/admin/review/ReviewPage";
import NotificationsPageAdmin from "../pages/admin/notification/NotificationsPage";
import CreateNotificationPage from "../pages/admin/notification/CreateNotificationPage";
import EditNotificationPage from "../pages/admin/notification/EditNotificationPage";
import NotificationDetailPage from "../pages/admin/notification/NotificationDetailPage";
import NotificationStatsPage from "../pages/admin/notification/NotificationStatsPage";

const ADMIN = process.env.REACT_APP_ADMIN;

export const routes = [
  /* Client */
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
    path: "/book/:slugCategory",
    page: CategoryBooksPage,
    isShowHeader: true,
  },
  {
    path: "/book/featured",
    page: FeaturedBooksPage,
    isShowHeader: true,
  },
  {
    path: "/book/new",
    page: NewBooksPage,
    isShowHeader: true,
  },
  {
    path: "/order",
    page: OrderPage,
    isShowHeader: true,
  },
  {
    path: "/user",
    page: MyAccountPage,
    isShowHeader: true,
  },
  {
    path: "/cart",
    page: CartPage,
    isShowHeader: true,
  },
  {
    path: "/notifications",
    page: NotificationsPage,
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

  /* Admin */
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
    path: `/${ADMIN}/auth/forgot-password`,
    page: ForgotPasswordPageAdmin,
  },
  {
    path: `/${ADMIN}/auth/verify-otp`,
    page: VerifyOtpPageAdmin,
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
    path: `/${ADMIN}/book/edit/:id`,
    page: EditProductPage,
    isAdmin: true,
  },
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
  {
    path: `/${ADMIN}/role/permissions`,
    page: PermissionsPage,
    isAdmin: true,
  },
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
    path: `/${ADMIN}/my-account`,
    page: MyAccountPageAdmin,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/order`,
    page: OrderPageAdmin,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/user`,
    page: UserPage,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/reviews`,
    page: ReviewPage,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/notification`,
    page: NotificationsPageAdmin,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/notification/create`,
    page: CreateNotificationPage,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/notification/edit/:id`,
    page: EditNotificationPage,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/notification/detail/:id`,
    page: NotificationDetailPage,
    isAdmin: true,
  },
  {
    path: `/${ADMIN}/notification/stats`,
    page: NotificationStatsPage,
    isAdmin: true,
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
