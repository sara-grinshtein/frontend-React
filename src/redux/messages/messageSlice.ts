import { createSlice } from "@reduxjs/toolkit";
import { Message } from "../../types/messsage.types"

const initialState: Message[] = []

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages: (state, action) => {
            return action.payload
        },
        addMessage: (state, action) => {
            state.push(action.payload)
        }
    }
})

export const { setMessages, addMessage } = messagesSlice.actions
export default messagesSlice.reducer
