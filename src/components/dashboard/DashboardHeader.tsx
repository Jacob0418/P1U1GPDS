import { Vegan, Menu, LogOut, User } from "lucide-react";

const DashboardHeader = ({ user, onLogout, onSidebarOpen }) => (
  <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            onClick={onSidebarOpen}
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur opacity-40"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-teal-600 p-2.5 rounded-xl shadow-lg">
                <Vegan className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Gestión de Parcelas
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Panel de control</p>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 text-white text-sm font-semibold">
              {user?.email?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 leading-none">
                Usuario
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {user?.email}
              </span>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg font-medium shadow-sm hover:shadow-md hover:from-gray-800 hover:to-black transition-all duration-200 overflow-hidden"
            aria-label="Cerrar sesión"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
            <LogOut className="w-4 h-4 relative z-10" />
            <span className="relative z-10 hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </div>
  </header>
);

export default DashboardHeader;