import { createSlice } from "@reduxjs/toolkit";
import { Helped } from "../../types/helped.types"
 
const initialState: Helped[] = []

const helpedsSlice = createSlice({
    name: 'helpeds',
    initialState,
    reducers: {
        setHelpeds: (state, action) => {
            return action.payload
        },
        addHelped: (state, action) => {
            state.push(action.payload)
        }
    }
})

export const { setHelpeds, addHelped } = helpedsSlice.actions
export default helpedsSlice.reducer
