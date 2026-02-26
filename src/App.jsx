import React, { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function AppContent() {
  const { user, loading } = useContext(AuthContext);

  if(loading) return <div>Loading...</div>; // wait for refresh-token check

  return user ? <Dashboard /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;