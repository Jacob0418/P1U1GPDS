import { useState, useEffect } from 'react';
import { 
  Sprout, 
  Cloud, 
  Thermometer, 
  Droplets, 
  Sun, 
  Activity,
  Shield,
  Database,
  BarChart3,
  MapPin,
  Zap,
  ChevronRight,
  Play,
  Monitor,
  User,
  LogOut
} from 'lucide-react';
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
const navigate = useNavigate();
const { user, signOut } = useAuth();

const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // El usuario se quedará en la página de inicio
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const [currentSensorData, setCurrentSensorData] = useState({
    temperature: 24.5,
    humidity: 65,
    rainfall: 2.3,
    solarRadiation: 850
  });

  // Simular datos de sensores en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSensorData({
        temperature: 20 + Math.random() * 15,
        humidity: 40 + Math.random() * 40,
        rainfall: Math.random() * 10,
        solarRadiation: 600 + Math.random() * 400
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Monitoreo en Tiempo Real",
      description: "Seguimiento continuo de sensores virtuales con datos actualizados cada 1-5 segundos"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Alta Concurrencia",
      description: "Procesamiento asíncrono de +10,000 registros por minuto con arquitectura de microservicios"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Dashboards Interactivos",
      description: "Visualización avanzada con gráficos de línea, barras y distribución de datos"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Seguridad DevOps",
      description: "Autenticación JWT, roles de usuario y despliegue controlado con CI/CD"
    }
  ];

  const microservices = [
    {
      name: "Autenticación",
      description: "JWT, roles admin/usuario",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-blue-500"
    },
    {
      name: "Sensores Virtuales",
      description: "Temperatura, humedad, lluvia, radiación",
      icon: <Thermometer className="w-6 h-6" />,
      color: "bg-green-500"
    },
    {
      name: "Ingesta de Datos",
      description: "Streaming concurrente y verificación",
      icon: <Database className="w-6 h-6" />,
      color: "bg-purple-500"
    },
    {
      name: "Gestión de Parcelas",
      description: "CRUD completo con historial",
      icon: <MapPin className="w-6 h-6" />,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-emerald-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AgroIoT DevOps</h1>
                <p className="text-sm text-emerald-600">Sistema Integral Agrícola</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-colors">Características</a>
              <a href="#architecture" className="text-gray-700 hover:text-emerald-600 transition-colors">Arquitectura</a>
              <NavLink to="/dashboard" className="text-gray-700 hover:text-emerald-600 transition-colors">Dashboard</NavLink>
              {/* Mostrar diferentes elementos según el estado de autenticación */}
              {user ? (
                // Usuario autenticado - mostrar email y botón de logout
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                  </button>
                </div>
              ) : (
                // Usuario no autenticado - mostrar botón de login
                <button 
                  onClick={handleLoginClick} 
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-all transform hover:scale-105"
                >
                  Ingresar
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4 mr-2" />
                DevOps + IoT Agrícola
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Revolucionando la
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600"> Agricultura</span>
                <br />con IoT y DevOps
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Sistema integral que simula un entorno IoT agrícola con sensores virtuales, 
                procesamiento asíncrono de +10,000 registros y arquitectura de microservicios 
                con CI/CD completo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2" />
                  Ver Demo en Vivo
                </button>
                <button className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-lg hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center">
                  <Monitor className="w-5 h-5 mr-2" />
                  Dashboard
                </button>
              </div>
            </div>
            
            {/* Live Sensor Data Card */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-emerald-200 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Datos en Tiempo Real</h3>
                <div className="flex items-center text-emerald-600">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm">En Vivo</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
                  <Thermometer className="w-8 h-8 mx-auto text-red-500 mb-2" />
                  <div className="text-2xl font-bold text-red-600">{currentSensorData.temperature.toFixed(1)}°C</div>
                  <div className="text-sm text-gray-600">Temperatura</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                  <Droplets className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{currentSensorData.humidity.toFixed(0)}%</div>
                  <div className="text-sm text-gray-600">Humedad</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                  <Cloud className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
                  <div className="text-2xl font-bold text-indigo-600">{currentSensorData.rainfall.toFixed(1)}mm</div>
                  <div className="text-sm text-gray-600">Lluvia</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl">
                  <Sun className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">{currentSensorData.solarRadiation.toFixed(0)}</div>
                  <div className="text-sm text-gray-600">Radiación (W/m²)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sistema diseñado con las mejores prácticas de DevOps y arquitectura de microservicios 
              para un entorno IoT agrícola de alta concurrencia
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-3 rounded-lg w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Microservices Architecture */}
      <section id="architecture" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Arquitectura de Microservicios
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cuatro microservicios asincrónicos y concurrentes trabajando en perfecta armonía
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {microservices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className={`${service.color} text-white p-3 rounded-lg w-fit mb-4`}>
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                <div className="flex items-center text-emerald-600 text-sm">
                  Ver detalles <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Stats */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">+10,000</div>
              <div className="text-emerald-100">Registros por minuto</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1-5s</div>
              <div className="text-emerald-100">Actualización de sensores</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4</div>
              <div className="text-emerald-100">Microservicios</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-emerald-100">Disponibilidad</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            ¿Listo para Revolucionar tu Agricultura?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Accede al dashboard completo y comienza a monitorear tus parcelas con 
            tecnología IoT de última generación
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105">
              Acceder al Dashboard
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-emerald-600 hover:text-emerald-600 transition-all">
              Documentación DevOps
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">AgroIoT DevOps</h3>
              </div>
              <p className="text-gray-400">
                Sistema integral de IoT agrícola con arquitectura DevOps completa
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">DevOps</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">CI/CD</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Monitoreo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Infraestructura</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Estado</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AgroIoT DevOps. Sistema integral para agricultura de precisión.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;