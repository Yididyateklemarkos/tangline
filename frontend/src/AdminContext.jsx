import { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [password, setPassword] = useState(sessionStorage.getItem('admin_pw') || '');

  function login(pw) {
    setPassword(pw);
    sessionStorage.setItem('admin_pw', pw);
  }
  function logout() {
    setPassword('');
    sessionStorage.removeItem('admin_pw');
  }

  return (
    <AdminContext.Provider value={{ password, login, logout, isAuthed: !!password }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
