 export type Volunteer = {
  volunteer_id?: number
  password: string
  volunteer_first_name: string
  volunteer_last_name?: string
  start_time?: string
  end_time?: string
  tel?: string
  email: string
  areas_of_knowledge: { iD_knowledge: number }[]
  isDeleted: boolean
  latitude?: number
  longitude?: number
  assignment_count: number
}
