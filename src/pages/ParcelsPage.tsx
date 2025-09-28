import React, { useState, useEffect } from 'react'
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Leaf, 
  User,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import SidebarComponent from '../widgets/sidebar/sidebar'
import { ParcelService } from '../service/parcelService'
import type { Parcel, CreateParcelRequest, UpdateParcelRequest } from '../types/parcel'

const ParcelsPage: React.FC = () => {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    crop: ''
  })

  useEffect(() => {
    loadParcels()
  }, [])

  const loadParcels = async () => {
    setLoading(true)
    const { data, error } = await ParcelService.getAllParcels()
    
    if (error) {
      setError('Error al cargar las parcelas')
      console.error(error)
    } else {
      setParcels(data || [])
    }
    setLoading(false)
  }

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    if (term.trim() === '') {
      loadParcels()
      return
    }

    setLoading(true)
    const { data, error } = await ParcelService.searchParcels(term)
    
    if (error) {
      setError('Error en la búsqueda')
      console.error(error)
    } else {
      setParcels(data || [])
    }
    setLoading(false)
  }

  const handleCreateParcel = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const parcelData: CreateParcelRequest = {
      name: formData.name,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      crop: formData.crop || undefined
    }

    const { data, error } = await ParcelService.createParcel(parcelData)

    if (error) {
      setError('Error al crear la parcela')
      console.error(error)
    } else {
      setSuccess('Parcela creada exitosamente')
      setShowCreateModal(false)
      setFormData({ name: '', latitude: '', longitude: '', crop: '' })
      loadParcels()
    }
  }

  const handleUpdateParcel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedParcel) return

    setError('')
    setSuccess('')

    const updateData: UpdateParcelRequest = {
      name: formData.name,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      crop: formData.crop || undefined
    }

    const { data, error } = await ParcelService.updateParcel(selectedParcel.id, updateData)

    if (error) {
      setError('Error al actualizar la parcela')
      console.error(error)
    } else {
      setSuccess('Parcela actualizada exitosamente')
      setShowEditModal(false)
      setSelectedParcel(null)
      setFormData({ name: '', latitude: '', longitude: '', crop: '' })
      loadParcels()
    }
  }

  const handleDeleteParcel = async (id: string) => {
    console.log('Deleting parcel with id:', id)
    if (!confirm('¿Estás seguro de que deseas eliminar esta parcela?')) return

    const { error } = await ParcelService.deleteParcel(id)

    if (error) {
      setError('Error al eliminar la parcela')
      console.error(error)
    } else {
      setSuccess('Parcela eliminada exitosamente')
      loadParcels()
    }
  }

  const openEditModal = (parcel: Parcel) => {
    setSelectedParcel(parcel)
    setFormData({
      name: parcel.name,
      latitude: parcel.latitude?.toString() || '',
      longitude: parcel.longitude?.toString() || '',
      crop: parcel.crop || ''
    })
    setShowEditModal(true)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex">
      <SidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-emerald-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestión de Parcelas</h1>
                  <p className="text-sm text-emerald-600">{parcels.length} parcelas registradas</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nueva Parcela
              </button>
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
                placeholder="Buscar parcelas por nombre o cultivo..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              />
            </div>
          </div>

          {/* Parcels Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : parcels.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay parcelas</h3>
              <p className="text-gray-500">Comienza creando tu primera parcela</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parcels.map((parcel) => (
                <div key={parcel.id} className="bg-white rounded-xl shadow-lg border border-emerald-200 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg">
                        <Leaf className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{parcel.name}</h3>
                        {parcel.crop && (
                          <p className="text-sm text-emerald-600">{parcel.crop}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(parcel)}
                        className="text-blue-500 hover:text-blue-700 p-1 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteParcel(parcel.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {parcel.latitude && parcel.longitude && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {parcel.latitude.toFixed(4)}, {parcel.longitude.toFixed(4)}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Creada: {formatDate(parcel.created_at)}
                    </div>
                    {parcel.updated_at !== parcel.created_at && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        Actualizada: {formatDate(parcel.updated_at)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nueva Parcela</h2>
              <form onSubmit={handleCreateParcel} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Parcela *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Ej: Parcela Norte"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitud
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="21.1234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitud
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="-101.6789"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cultivo
                  </label>
                  <input
                    type="text"
                    value={formData.crop}
                    onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Ej: Maíz, Trigo, Sorgo"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setFormData({ name: '', latitude: '', longitude: '', crop: '' })
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all"
                  >
                    Crear Parcela
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Parcela</h2>
              <form onSubmit={handleUpdateParcel} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Parcela *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitud
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitud
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cultivo
                  </label>
                  <input
                    type="text"
                    value={formData.crop}
                    onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setSelectedParcel(null)
                      setFormData({ name: '', latitude: '', longitude: '', crop: '' })
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    Actualizar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ParcelsPage