import React from 'react'
import { useAuth } from "../auth/AuthContext";

const Administrador = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Cargando usuario...</div>;
  }

  return (
    <div>Bienvenido, {user.name}</div>
  );
}

export default Administrador