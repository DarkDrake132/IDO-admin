import { useNavigate } from 'react-router-dom'
import { useEffect, useContext } from 'react'
import { AuthContext } from '../context/auth.context';

export function IsLoginMiddleware({children}) {
  const navigate = useNavigate();
  const { authLogin } = useContext(AuthContext);
  
  useEffect(() => {
    if (authLogin) {
      navigate("/")
    }
  }, [authLogin])

  return children;
}

export function AuthMiddleware({ children }) {
  const navigate = useNavigate();
  const { authLogin } = useContext(AuthContext);

  useEffect(() => {
    if (!authLogin)
        navigate("/login")
  }, [])

  return children;
}