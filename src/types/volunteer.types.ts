export type Volunteer  = {
    volunteer_id: number
    password: string
    volunteer_first_name: string
    volunteer_last_name?: string
    location?: string
    start_time?: string
    end_time?: string
    tel?: string
    email: string
    areas_of_knowledge?: any[]
    IsDeleted: boolean
}
