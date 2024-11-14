import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Cart, Catalog, Home, Product,Dashboard  } from "../pages"; // Import the Dashboard component
import LoginPage from "../pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "catalog",
        element: <Catalog />,
        children: [
          {
            path: ":id",
            element: <Catalog />,
          },
        ],
      },
      {
        path: "products",
        children: [
          {
            path: ":id",
            element: <Product />,
          },
        ],
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "dashboard", // Add this line for the Dashboard route
        element: <Dashboard />, // Link the Dashboard component
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
]);
