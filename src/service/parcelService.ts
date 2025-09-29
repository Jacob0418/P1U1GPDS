import { supabase } from '../supabase/supabase'
import type { Parcel, CreateParcelRequest, UpdateParcelRequest } from '../types/parcel';

export class ParcelService {
  // Obtener todas las parcelas del usuario autenticado
  static async getAllParcels(): Promise<{ data: Parcel[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('parcels')
        .select('*')
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      console.error('Error fetching parcels:', error)
      return { data: null, error }
    }
  }

  // Obtener una parcela por ID
  static async getParcelById(id: string): Promise<{ data: Parcel | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('parcels')
        .select('*')
        .eq('id', id)
        .single()

      return { data, error }
    } catch (error) {
      console.error('Error fetching parcel:', error)
      return { data: null, error }
    }
  }

  // Crear nueva parcela
  static async createParcel(parcelData: CreateParcelRequest): Promise<{ data: Parcel | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('parcels')
        .insert([parcelData])
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Error creating parcel:', error)
      return { data: null, error }
    }
  }

  // Actualizar parcela
  static async updateParcel(id: string, parcelData: UpdateParcelRequest): Promise<{ data: Parcel | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('parcels')
        .update({ ...parcelData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Error updating parcel:', error)
      return { data: null, error }
    }
  }

  // Eliminar parcela (soft delete - puedes modificar según necesites)
  static async deleteParcel(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('parcels')
        .delete()
        .eq('id', id)

      return { error }
    } catch (error) {
      console.error('Error deleting parcel:', error)
      return { error }
    }
  }

  // Buscar parcelas por nombre o cultivo
  static async searchParcels(searchTerm: string): Promise<{ data: Parcel[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('parcels')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,crop.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      console.error('Error searching parcels:', error)
      return { data: null, error }
    }
  }

  
 // Obtener todas las parcelas eliminadas
  static async getDeletedParcels(): Promise<{ data: Parcel[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('parcels_deleted')
        .select('*')
        .order('deleted_at', { ascending: false })

      return { data, error }
    } catch (error) {
      console.error('Error fetching deleted parcels:', error)
      return { data: null, error }
    }
  }

  // Eliminar definitivamente de parcels_deleted
  static async permanentlyDeleteParcel(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('parcels_deleted')
        .delete()
        .eq('id', id)

      return { error }
    } catch (error) {
      console.error('Error permanently deleting parcel:', error)
      return { error }
    }
  }

  // Restaurar parcela (mueve de deleted -> parcels)
  static async restoreParcel(parcel: Parcel): Promise<{ error: any }> {
    try {
      const { error: insertError } = await supabase
        .from('parcels')
        .insert([{
          id: parcel.id,
          name: parcel.name,
          latitude: parcel.latitude,
          longitude: parcel.longitude,
          crop: parcel.crop,
          created_at: parcel.created_at,
          updated_at: parcel.updated_at
        }])

      if (insertError) return { error: insertError }

      // Si insertó bien, la borramos de parcels_deleted
      const { error: deleteError } = await supabase
        .from('parcels_deleted')
        .delete()
        .eq('id', parcel.id)

      return { error: deleteError }
    } catch (error) {
      console.error('Error restoring parcel:', error)
      return { error }
    }
  }
}