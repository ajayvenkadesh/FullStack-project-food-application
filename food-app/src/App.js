import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Header from "./components/landing_page/Header";
import Footer from "./components/landing_page/Footer";
import Home from "./routes/Home";
import Login from "./components/user/Login";
import NotFound from "./routes/NotFound";
import SignUp from "./components/user/SignUp";
import AddRestaurent from "./components/owner/AddRestaurent";
import Food_item from "./routes/Food_item";
import Cart from "./components/add_cart/Cart";
import { createContext } from "react";
import { CartProvider } from "./components/add_cart/CartContext";
import Restaurent_login from "./components/owner/Restaurent_login";
import Admin_login from "./components/admin/Admin_login";
import Admin_view from "./components/admin/Admin_view";
import Owner_view from "./components/owner/Owner_view";
import AddMenu from "./components/owner/AddMenu";
import Add_favorite from "./components/user/Add_favorite";
import { FavoritesProvider } from './components/user/FavoriteContext';
import { UserProvider } from './components/user/UserContext'; // Import UserProvider
import { OwnerProvider } from "./components/owner/OwnerContext";
import View_menus from "./components/owner/View_menus";
import View_order from "./components/owner/View_order";
import OTpView from "./components/user/OTpView";
import ForgotPassword from "./components/user/ForgotPassword";
import OrderSummary from "./components/add_cart/OrderSummary";
import OrderSummaryTable from "./components/add_cart/OrderSummaryTable";
import OrderForm from "./components/add_cart/OrderForm";
import EditProfile from "./components/user/EditProfile";
import { SelectedRestaurantProvider } from "./components/landing_page/SelectedRestaurantContext"

export const categoryContext = createContext();

function App() {
  const [type, setType] = useState('all');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);


  //handle owner login
  const handleOwnerLogin = () => {
    setIsOwner(true);    
  };

  const handleOwnerLogout = () => {
    setIsOwner(false);
  }; 

  //handle user login  
  const handleLogin = () => {
    setIsLoggedIn(true);       
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  //admin login
  const handleAdminLogin = () => { 
    setIsAdmin(true);
  };

  const handleAdminLogout = () => { 
    setIsAdmin(false);
  };




  return (


    <OwnerProvider>
    <UserProvider> {/* Make sure the entire app is wrapped inside UserProvider */}
      <SelectedRestaurantProvider>
      <FavoritesProvider>
        <CartProvider>
          <categoryContext.Provider value={{
            type, setType,
            isLoggedIn, handleLogin, handleLogout,
            isAdmin, handleAdminLogin, handleAdminLogout,
            isOwner, handleOwnerLogin, handleOwnerLogout,
            setIsLoggedIn, setIsAdmin, setIsOwner
          }}>
            <Router>
              <Header/>
              <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/OtpPage" element={<OTpView/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/restaurantHome" element={<Owner_view/>}/>
                <Route path="/ordersummarytable" element={<OrderSummaryTable/>} />
                <Route path="/orderSummary" element={<OrderSummary />} />
                <Route path="/edit-profile" element ={<EditProfile/>}/>
                <Route path="/orderForm" element={<OrderForm />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/Admin" element={<Admin_login />} />
                <Route path="/Admin-view" element={isAdmin ? <Admin_view/> : <Navigate to="/home" />} />
                <Route path="/Owner-signup" element={<AddRestaurent />} />
                <Route path="/Owner-login" element={<Restaurent_login />} />
                <Route path="/Owner-view" element={isOwner ? <Owner_view/> : <Navigate to="/home" />} />
                <Route path="/owner_menuView" element={isOwner? <View_menus/> : <Navigate to="/home" /> } />
                <Route path="/owner_orderView" element={isOwner? <View_order/> : <Navigate to="/home" /> } />
                <Route path="/restaurants/menu/:restaurantEmailId" element={<Food_item />} />
                <Route path="/cart" element={isLoggedIn ? <Cart/> : <Navigate to="/home" />} />
                <Route path="/addMenu" element={isOwner ? <AddMenu/> : <Navigate to="/home" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer/>
            </Router>
          </categoryContext.Provider> 
        </CartProvider> 
      </FavoritesProvider> 
      </SelectedRestaurantProvider>
    </UserProvider>
    </OwnerProvider>
  );
}

export default App;
