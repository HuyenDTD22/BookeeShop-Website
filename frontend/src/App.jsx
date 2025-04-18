import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultComponent from "./components/client/DefaultComponent";
import AdminLayoutComponent from "./components/admin/AdminLayoutComponent";
import { routes } from "./routes";

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
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
