export interface Parcel {
  id: string
  name: string
  latitude: number | null
  longitude: number | null
  crop: string | null
  owner: string
  created_at: string
  updated_at: string
}

export interface CreateParcelRequest {
  name: string
  latitude?: number
  longitude?: number
  crop?: string
}

export interface UpdateParcelRequest {
  name?: string
  latitude?: number
  longitude?: number
  crop?: string
}