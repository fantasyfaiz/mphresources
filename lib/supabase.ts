import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qovmhyrusxoyrzfohjfa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvdm1oeXJ1c3hveXJ6Zm9oamZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MDkyMzEsImV4cCI6MjA4OTM4NTIzMX0.zrlmE135aNd_1l0gKiDjpkENICBd25fssj3piUkJGv0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Resource = {
  id: number
  name: string
  subtitle: string
  description: string
  section: string
  tags: string
  link: string
  members: string
  location: string
  location_scope: string
  audience: string
  career_fields: string
  career_stage: string
  is_active: boolean
  notes: string
}
