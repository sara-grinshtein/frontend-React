import { createSlice } from "@reduxjs/toolkit";
import { MessageType } from "../../types/messsage.types"

const initialState: MessageType[] = []

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
