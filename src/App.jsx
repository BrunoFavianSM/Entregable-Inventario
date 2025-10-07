import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Customers from './pages/Customers';
import Locations from './pages/Locations';
import Alerts from './pages/Alerts';
import { connectSocket, disconnectSocket } from './services/socket';
import { alertAPI } from './services/api';
import './styles/globals.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    // Conectar Socket.io al iniciar
    connectSocket();
    
    // Obtener conteo de alertas
    fetchAlertCount();
    
    // Limpiar al desmontar
    return () => {
      disconnectSocket();
    };
  }, []);

  const fetchAlertCount = async () => {
    try {
      const response = await alertAPI.getActive();
      if (response.success) {
        setAlertCount(response.data.length);
      }
    } catch (error) {
      console.error('Error al obtener alertas:', error);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          alertCount={alertCount}
        />
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <main className="lg:ml-64 pt-[73px] p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/alerts" element={<Alerts />} />
          </Routes>
        </main>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
