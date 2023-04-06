import { apiSlice } from "../../app/api/apiSlice";

interface Result {
		date:  number;
		time: string ;
}

interface Response{
	result: Result[];
}

export interface HairStyle {
	name: string;
    price: string;
    hairStyleId: string;
    createdAt: string;
    updatedAt: string;
}

export const appointmentApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getCustomerAppointments: builder.query({

			query: (customerid) => `/appointment/customer/${customerid}`,
			transformResponse: (response: Response) => {
				// console.log(response, "TRANSFORMED RESPONSE!!!!!!!!!!!11");
				const sorted = response.result.sort(
					(a:Result, b:Result) =>
						a.date - b.date && parseInt(a.time) - parseInt(b.time)
				);
				// console.log(sorted, "SORTED TRANSFORMED RESPONSE!!!!!!!!!!!11");

				return sorted;
			},
			providesTags: ['Appointment'],
		}),
		getAvailableTime: builder.mutation({
			query: (date:string) => `/appointment/availtime/${date}`,
		}),
		generateCalenderModal: builder.mutation({
			query: (info) =>
				`/calender/${info.custId}/${info.month}/${info.year}/modal`,
			
		}),
		generateCalender: builder.query({
			query: (info: {year:string, month: string, custid: string}) =>
				`/calender/${info.custid}/${info.month}/${info.year}`,
			providesTags: ['Appointment'],
		}),
		getAllHairStyles: builder.query<any, void>({
			query: () => `/hairstyle/`,
			providesTags: ["Hairstyle"]
		}),
		createNewHairStyle: builder.mutation({
			query({ body }) {
				return {
					url: `/hairstyle`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["Hairstyle"]
		}),
		updateHairStyle: builder.mutation({
			query({ hairStyleId, body }:{hairStyleId: string, body: unknown}) {
				return {
					url: `/hairstyle/${hairStyleId}`,
					method: "PUT",
					body: body,
				};
			},
			invalidatesTags: ["Hairstyle"]
		}),
		createNewAppointment: builder.mutation({
			query: ({ custId, body }) => {
				return {
					url: `/appointment/create/${custId}`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["Appointment"],
			
		}),
		updateAppointment: builder.mutation({
			query({ appointmentId, body }) {
				return {
					url: `/appointment/update/${appointmentId}`,
					method: "PUT",
					body: body,
				};
			},
			transformResponse: (response) => {
				// console.log(response, "response data !!!!1 from request");
				return response;
			},
			invalidatesTags: ["Appointment"]
		}),
		deleteApppointment: builder.mutation({
			query(appointmentId) {
				return {
					url: `/appointment/delete/${appointmentId}`,
					method: "DELETE",
				};
			},
			invalidatesTags: ["Appointment"]
		}),
		analytics: builder.query({
			query: () =>
				`/analytics`,
		
		})
	}),
});

export const {
	useGetCustomerAppointmentsQuery,
	useGetAvailableTimeMutation,
	useLazyGenerateCalenderQuery,
	useGenerateCalenderModalMutation,
	useGetAllHairStylesQuery,
	useCreateNewAppointmentMutation,
	useUpdateAppointmentMutation,
	useDeleteApppointmentMutation,
	useUpdateHairStyleMutation,
	useCreateNewHairStyleMutation,
	useAnalyticsQuery
} = appointmentApiSlice;
