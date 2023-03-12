import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface AuthState {
    customer: {
        username: string;
        email: string;
        custId: string;
    } | null;
    token: string | null;
}

const initialState: AuthState  = {
    customer: null,
    token: null
}
const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setCredentials: (state, action)=> {
            const { customer, accessToken } = action.payload;
			state.customer = customer;
			state.token = accessToken;
        },
        logOut: (state)=> {
            state.customer = null;
            state.token = null;
        }
    }
})


export default authSlice.reducer;

export const {setCredentials, logOut} = authSlice.actions

export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthCustomer = (state: RootState)=> state.auth.customer;