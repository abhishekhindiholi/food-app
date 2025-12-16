import Login from "./auth/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import HereSection from "./components/HeroSection";
import MainLayout from "./layout/MainLayout";
import Profile from "./components/Profile";
import SearchPage from "./components/SearchPage";
import RestaurantDetail from "./components/RestaurantDetail";
import Cart from "./components/Cart";
import Restaurant from "./admin/Restaurant";
import AddMenu from "./admin/AddMenu";
import Orders from "./admin/Orders";
import Success from "./components/Success";
import LandingPage from "./components/LandingPage";
import { useUserStore } from "./store/useUserStore";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import Loading from "./components/Loading";
import { useThemeStore } from "./store/useThemeStore";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUserStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  if(isAuthenticated && user?.isVerified){
    return <Navigate to="/dashboard" replace/>
  }
  return children;
};

const AdminRoute = ({children}:{children:React.ReactNode}) => {
  const {user, isAuthenticated} = useUserStore();
  if(!isAuthenticated){
    return <Navigate to="/login" replace/>
  }
  if(!user?.admin){
    return <Navigate to="/" replace/>
  }

  return children;
}

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/restaurant/:id",
    element: <RestaurantDetail />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/dashboard",
        element: <HereSection />,
      },
      {
        path: "/dashboard/profile",
        element: <Profile />,
      },
      {
        path: "/dashboard/search/:text",
        element: <SearchPage />,
      },
      {
        path: "/dashboard/cart",
        element: <Cart />,
      },
      {
        path: "/dashboard/order/status",
        element: <Success />,
      },
      {
        path: "/dashboard/admin/restaurant",
        element:<AdminRoute><Restaurant /></AdminRoute>,
      },
      {
        path: "/dashboard/admin/menu",
        element:<AdminRoute><AddMenu /></AdminRoute>,
      },
      {
        path: "/dashboard/admin/orders",
        element:<AdminRoute><Orders /></AdminRoute>,
      },
    ],
  },
  {
    path: "/login",
    element:<AuthenticatedUser><Login /></AuthenticatedUser>,
  },
  {
    path: "/signup",
    element:<AuthenticatedUser><Signup /></AuthenticatedUser> ,
  },
  {
    path: "/forgot-password",
    element: <AuthenticatedUser><ForgotPassword /></AuthenticatedUser>,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);

function App() {
  const initializeTheme = useThemeStore((state:any) => state.initializeTheme);
  const {checkAuthentication, isCheckingAuth} = useUserStore();
  useEffect(()=>{
    checkAuthentication();
    initializeTheme();
  },[checkAuthentication])

  if(isCheckingAuth) return <Loading/>
  return (
    <main>
      <RouterProvider router={appRouter}></RouterProvider>
    </main>
  );
}

export default App;