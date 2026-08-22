import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import QuemVaiUsar from './pages/QuemVaiUsar';
import AreaResponsavel from './pages/AreaResponsavel';
import Cadastro from './pages/Cadastro';
import EscolhaAmigo from './pages/EscolhaAmigo';
import Inicio from './pages/Inicio';
import RequireGuardianAuth from './components/RequireGuardianAuth';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/quem-vai-usar" element={<QuemVaiUsar />} />
      <Route path="/area-responsavel" element={<AreaResponsavel />} />
      <Route
        path="/cadastro"
        element={
          <RequireGuardianAuth>
            <Cadastro />
          </RequireGuardianAuth>
        }
      />
      <Route path="/escolha-amigo" element={<EscolhaAmigo />} />
      <Route path="/inicio" element={<Inicio />} />
    </Routes>
  );
}
