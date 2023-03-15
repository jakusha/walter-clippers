import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import { setCredentials, logOut } from "../../features/auth/authSlice";
import { object } from "joi";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3333",
    credentials: "include",
    prepareHeaders(headers, { getState }: {getState: ()=> any}) {
        const token:string | null =  getState()?.auth?.token;
        if(token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        return headers

    },
})


const baseQueryWithReauth:BaseQueryFn = async (args, api, extraOptions) => {
    
	let result:any = await baseQuery(args, api, extraOptions);
	console.log(result, "RESULT FROM AUTH!!!!!!!!!!1111");
	if (result?.error?.originalStatus === 403) {
		console.log("sending refresh token");
		// send refresh token to get new access token
		const refreshResult = await baseQuery(
			"/auth/refresh/",
			api,
			extraOptions
		);
		console.log(refreshResult);
		if (refreshResult?.data) {   
                const user:any = api?.getState().auth.user;
                // store the new token
                api.dispatch(setCredentials({ ...refreshResult.data, user }));
                // retry the original query with new access token
                result = await baseQuery(args, api, extraOptions);
            
            
		} else {
			api.dispatch(logOut());
		}
	}

	return result;
};

export const apiSlice = createApi({
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({}),
	tagTypes: ["Appointment", "Hairstyle"]
});
