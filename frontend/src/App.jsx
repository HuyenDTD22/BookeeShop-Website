import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultComponent from "./components/client/layout/DefaultComponent";
import AdminLayoutComponent from "./components/admin/layout/AdminLayoutComponent";
import { routes } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRouteComponent from "./components/admin/layout/ProtectedRouteComponent";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const Layout = route.isAdmin
              ? AdminLayoutComponent
              : route.isShowHeader
              ? DefaultComponent
              : Fragment;

            const Element = route.isAdmin ? (
              <AuthProvider>
                {route.path.includes("auth/login") ? (
                  <Layout>
                    <Page />
                  </Layout>
                ) : (
                  <ProtectedRouteComponent>
                    <Layout>
                      <Page />
                    </Layout>
                  </ProtectedRouteComponent>
                )}
              </AuthProvider>
            ) : (
              <Layout>
                <Page />
              </Layout>
            );

            return (
              <Route key={route.path} path={route.path} element={Element} />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
