import React, { useState, useEffect } from 'react'
import { 
  Trash2, 
  RefreshCw,
  TrashIcon,
  Search,
  Calendar,
  AlertCircle,
  CheckCircle,
  Archive,
  Leaf
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import SidebarComponent from '../widgets/sidebar/sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import { ParcelService } from '../service/parcelService'
import type { Parcel } from '../types/parcel'
import Swal from 'sweetalert2';

const DeletedParcelsPage: React.FC = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [deletedParcels, setDeletedParcels] = useState<Parcel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  useEffect(() => {
    fetchDeleted()
  }, [])

  const fetchDeleted = async () => {
    setLoading(true)
    const { data, error } = await ParcelService.getDeletedParcels()
    
    if (error) {
      setError('Error al cargar las parcelas eliminadas')
      console.error(error)
    } else {
      setDeletedParcels(data || [])
    }
    setLoading(false)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    // Filtro local para las parcelas eliminadas
    if (term.trim() === '') {
      fetchDeleted()
      return
    }

    const filtered = deletedParcels.filter(parcel => 
      parcel.name.toLowerCase().includes(term.toLowerCase()) ||
      (parcel.crop && parcel.crop.toLowerCase().includes(term.toLowerCase()))
    )
    setDeletedParcels(filtered)
  }

  const handleRestore = async (parcel: Parcel) => {
    setError('')
    setSuccess('')

    const { error } = await ParcelService.restoreParcel(parcel)
    
    if (error) {
      setError('Error al restaurar la parcela')
      console.error(error)
    } else {
      setSuccess('Parcela restaurada exitosamente')
      fetchDeleted()
    }
  }

  const handlePermanentDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres eliminar definitivamente esta parcela? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    })

    if (!result.isConfirmed) return

    setError('')
    setSuccess('')

    const { error } = await ParcelService.permanentlyDeleteParcel(id)

    if (error) {
      setError('Error al eliminar la parcela permanentemente')
      console.error(error)
    } else {
      setSuccess('Parcela eliminada permanentemente')
      fetchDeleted()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filtrar parcelas según el término de búsqueda
  const filteredParcels = deletedParcels.filter(parcel =>
    parcel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (parcel.crop && parcel.crop.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 flex">
      <SidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-64">
        {/* Header con botón de logout */}
        <DashboardHeader
          user={user}
          onLogout={handleLogout}
          onSidebarOpen={() => setSidebarOpen(true)}
        />

        {/* Header de la página */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-red-200 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-red-500 to-orange-600 p-2 rounded-lg">
                  <Archive className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Parcelas eliminadas</h1>
                  <p className="text-sm text-red-600">{deletedParcels.length} parcelas en la papelera</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Alerts */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              {success}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar parcelas eliminadas por nombre o cultivo..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              />
            </div>
          </div>

          {/* Deleted Parcels List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : filteredParcels.length === 0 ? (
            <div className="text-center py-12">
              <Archive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm ? 'No se encontraron parcelas' : 'No hay parcelas eliminadas'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Las parcelas eliminadas aparecerán aquí'}
              </p>
              {!searchTerm && (
                <div className="mt-6 p-6 bg-orange-50 border-2 border-orange-300 rounded-xl max-w-2xl mx-auto">
                  <div className="flex items-center justify-center mb-3">
                    <AlertCircle className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-lg font-semibold text-orange-900 mb-2">
                    ¿Necesitas recuperar parcelas eliminadas?
                  </p>
                  <p className="text-orange-700 text-base">
                    Para recuperar parcelas eliminadas, contacte con el administrador
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredParcels.map((parcel) => (
                <div key={parcel.id} className="bg-white rounded-xl shadow-lg border border-red-200 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="bg-gradient-to-br from-red-500 to-orange-600 p-3 rounded-lg">
                        <Leaf className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{parcel.name}</h3>
                          {parcel.crop && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                              {parcel.crop}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {parcel.latitude && parcel.longitude && (
                            <div className="flex items-center">
                              <span className="mr-1">📍</span>
                              {parcel.latitude.toFixed(4)}, {parcel.longitude.toFixed(4)}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Eliminada: {formatDate(parcel.updated_at || parcel.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleRestore(parcel)}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Restaurar
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(parcel.id)}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
                      >
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Eliminar definitivo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default DeletedParcelsPage