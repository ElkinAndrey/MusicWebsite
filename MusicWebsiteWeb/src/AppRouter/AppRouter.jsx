import React from "react";
import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Header from "../layouts/Header/Header";
import Genres from "../pages/Genres/Genres";
import Songs from "../pages/Songs/Songs";
import Singer from "../pages/Singers/Singers";
import Song from "../pages/Song/Song";

const AppRouter = () => {
  const routes = [
    { path: "/", element: <Songs />, exact: true },
    { path: "/*", element: <Navigate to="/" />, exact: true },
    { path: "/genres", element: <Genres />, exact: true },
    { path: "/singer", element: <Singer />, exact: true },
    { path: "/:id", element: <Song />, exact: true },
    // { path: "/persons/:id", element: <Person />, exact: true },
  ];

  return (
    <div>
      <Header />
      <Routes path="/">
        {routes.map((route, index) => (
          <Route
            key={index}
            exact={route.exact}
            path={route.path}
            element={route.element}
          ></Route>
        ))}
      </Routes>
    </div>
  );
};

export default AppRouter;
