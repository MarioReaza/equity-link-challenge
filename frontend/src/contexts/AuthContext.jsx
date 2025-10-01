import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const response = await api.get('/user');
        setUser(response.data.user);
        setPermissions(response.data.permissions || []);
      } catch (error) {
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    localStorage.setItem('auth_token', response.data.token);
    setUser(response.data.user);
    setPermissions(response.data.permissions || []);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('auth_token');
    setUser(null);
    setPermissions([]);
  };

  // Función para verificar si el usuario tiene un permiso
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  // Función para verificar si el usuario tiene alguno de los permisos
  const hasAnyPermission = (permissionArray) => {
    return permissionArray.some(permission => permissions.includes(permission));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      permissions,
      login, 
      logout, 
      loading,
      hasPermission,
      hasAnyPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
