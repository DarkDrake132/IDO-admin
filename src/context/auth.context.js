import { createContext, useState } from "react";

export const AuthContext = createContext();

// export function useLocalContext() {
//   return useContext(AddContext);
// }

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user'))
  })
  const [authLogin, setAuthLogin] = useState(() => {
    if(currentUser){
      if(currentUser.end < Date.now()){
        localStorage.removeItem('user');
        return false;
      }
      return true;
    }
    else{
      return false;
    }
  });

  const value = {
    authLogin, setAuthLogin,
    currentUser, setCurrentUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}