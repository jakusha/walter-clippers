import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
			query: (credentials) => ({
				url: "/auth/login",
				method: "POST",
				body: { ...credentials },
			}),
		}),
		refreshToken: builder.mutation({
			query: () => ({
				url: "/auth/refresh",
				method: "GET",
			}),
		}),
		logout: builder.mutation({
			query: (credentials) => ({
				url: "/auth/logout",
				method: "GET",
			}),
		}),
		signup: builder.mutation({
			query: (credentials) => ({
				url: "/auth/signup",
				method: "POST",
				body: { ...credentials },
			}),
		})
    }),
})

export const {
	useLoginMutation,
	useRefreshTokenMutation,
	useLogoutMutation,
	useSignupMutation
} = authApiSlice;
