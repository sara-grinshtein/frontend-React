import { createSlice } from "@reduxjs/toolkit";
import { ResponseType } from "../../types/response.types"

const initialState: ResponseType[] = []

const responsesSlice = createSlice({
    name: 'responses',
    initialState,
    reducers: {
        setResponses: (state, action) => {
            return action.payload
        },
        addResponse: (state, action) => {
            state.push(action.payload)
        }
    }
})

export const { setResponses, addResponse } = responsesSlice.actions
export default responsesSlice.reducer
