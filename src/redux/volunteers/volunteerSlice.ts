import { createSlice } from "@reduxjs/toolkit";
import { Volunteer } from "../../types/volunteer.types"

const initialState: Volunteer[] = []

const volunteersSlice = createSlice({
    name: 'volunteers',
    initialState,
    reducers: {
        setVolunteers: (state, action) => {
            return action.payload
        },
        addVolunteer: (state, action) => {
            state.push(action.payload)
        }
    }
})

export const { setVolunteers, addVolunteer } = volunteersSlice.actions
export default volunteersSlice.reducer
