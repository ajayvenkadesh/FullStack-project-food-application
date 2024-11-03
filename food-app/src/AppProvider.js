
// import { Children, createContext,useState } from "react"; 

// export const AppContext = createContext();

// export default function AppProvider(){

//   const [category, setCategory] = useState('all');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);

  
//   //handle user login
  
//   const handleLogin = () => {
//     setIsLoggedIn(true);
    
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//   };

//   //admin login
//   const handleAdminLogin = () => { 
//     setIsAdmin(true);
//   };
//   const handleAdminLogout = () => { 
//     setIsAdmin(false);
//   };

//   return(
//     <AppContext.Provider value={{
//         category,
//         setCategory,
//         isLoggedIn,
//         handleLogin,
//         handleLogout,
//         isAdmin,
//         handleAdminLogin,
//         handleAdminLogout,
//     }}>
//         {Children}
//     </AppContext.Provider>
//   );
// }