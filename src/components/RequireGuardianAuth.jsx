import React from 'react';
import { Navigate } from 'react-router-dom';
import { isUnlocked } from '@/lib/guardianAuth';

// Envolve qualquer rota que só o responsável deve acessar.
// Uso no seu router:
//   <Route path="/cadastro" element={<RequireGuardianAuth><Cadastro /></RequireGuardianAuth>} />
export default function RequireGuardianAuth({ children }) {
  if (!isUnlocked()) {
    return <Navigate to="/area-responsavel" replace />;
  }
  return children;
}
