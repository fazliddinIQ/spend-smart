import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";

import Login from "./page/Login/Login";
import Register from "./page/Register/Register";
import Dashboard from "./page/Dashboard/Dashboard";

import HarajatQoshish from "./component/HarajatQoshish/HarajatQoshish";
import SonggiHarajatlar from "./component/SonggiHarajatlar/SonggiHarajatlar";

// Himoyalangan route komponenti
const PrivateRoute = ({ children }) => {
  const { user } = useAppContext();
  return user ? children : <Navigate to="/login" />;
};

const AuthRoute = ({ children }) => {
  const { user } = useAppContext();
  return !user ? children : <Navigate to="/dashboard" />;
};

// Router strukturasi
const RouterComponent = () => {
  const router = createBrowserRouter([
    { 
      path: "/login", 
      element: (
        <AuthRoute>
          <Login />
        </AuthRoute>
      ) 
    },
    { 
      path: "/register", 
      element: (
        <AuthRoute>
          <Register />
        </AuthRoute>
      ) 
    },
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      ),
      children: [
        { index: true, element: <Navigate to="harajatqoshish" /> }, 
        { path: "harajatqoshish", element: <HarajatQoshish /> },
        { path: "songgi", element: <SonggiHarajatlar /> }
      ]
    },
    { path: "*", element: <Navigate to="/dashboard" /> }
  ]);

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <AppProvider>
      <RouterComponent />
    </AppProvider>
  );
}

export default App;