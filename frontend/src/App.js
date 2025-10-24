import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AbaDiagnostico from './components/AbaDiagnostico';
import AbaFrequencia from './components/AbaFrequencia';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loginData, setLoginData] = useState({ username: 'epaz', password: 'password' }); // Valores pré-preenchidos para facilitar o teste
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // O token retornado pelo backend não inclui o prefixo "Bearer "
      const res = await axios.post('http://localhost:3001/login', loginData);
      setToken(`Bearer ${res.data.token}`); // Adicionar o prefixo "Bearer " para o header de autorização
      localStorage.setItem('token', `Bearer ${res.data.token}`);
      setError('');
    } catch (err) {
      setError('Login falhou: ' + (err.response?.data?.error || 'Erro desconhecido'));
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  if (!token) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Login - SISTEMA PROTEGER</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" value={loginData.username} onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} required />
          <input type="password" placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
          <button type="submit">Entrar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  return (
    <div className="App" style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>SISTEMA PROTEGER - Registro de Casos</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <Tabs>
        <TabList>
          <Tab>Diagnóstico</Tab>
          <Tab>Frequência</Tab>
          <Tab>Em breve 3</Tab>
          <Tab>Em breve 4</Tab>
        </TabList>
        <TabPanel><AbaDiagnostico token={token} /></TabPanel>
        <TabPanel><AbaFrequencia token={token} /></TabPanel>
        <TabPanel><p>Conteúdo da Aba 3</p></TabPanel>
        <TabPanel><p>Conteúdo da Aba 4</p></TabPanel>
      </Tabs>
    </div>
  );
}

export default App;
