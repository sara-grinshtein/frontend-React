import { createSlice } from "@reduxjs/toolkit";
import { Knowledge } from "../../types/Knowledge.types"

const initialState: Knowledge[] = []

const knowledgesSlice = createSlice({
    name: 'knowledges',
    initialState,
    reducers: {
        setKnowledges: (state, action) => {
            return action.payload
        },
        addKnowledge: (state, action) => {
            state.push(action.payload)
        }
    }
})

export const { setKnowledges, addKnowledge } = knowledgesSlice.actions
export default knowledgesSlice.reducer
