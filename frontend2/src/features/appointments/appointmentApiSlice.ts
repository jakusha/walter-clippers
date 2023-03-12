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
				console.log(response, "TRANSFORMED RESPONSE!!!!!!!!!!!11");
				const sorted = response.result.sort(
					(a:Result, b:Result) =>
						a.date - b.date && parseInt(a.time) - parseInt(b.time)
				);
				console.log(sorted, "SORTED TRANSFORMED RESPONSE!!!!!!!!!!!11");

				return sorted;
			},
		}),
		getAvailableTime: builder.mutation({
			query: (date) => `/appointment/availtime/${date}`,
		}),
		generateCalenderModal: builder.mutation({
			query: (info) =>
				`/calender/${info.custId}/${info.month}/${info.year}/modal`,
		}),
		generateCalender: builder.mutation({
			query: (info) =>
				`/calender/${info.custid}/${info.month}/${info.year}`,
		}),
		getAllHairStyles: builder.mutation({
			query: () => `/hairstyle/`,
		}),
		createNewAppointment: builder.mutation({
			query({ custId, body }) {
				return {
					url: `/appointment/create/${custId}`,
					method: "POST",
					body: body,
				};
			},
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
				console.log(response, "response data !!!!1 from request");
				return response;
			},
		}),
		deleteApppointment: builder.mutation({
			query(appointmentId) {
				return {
					url: `/appointment/delete/${appointmentId}`,
					method: "DELETE",
				};
			},
		}),
	}),
});

export const {
	useGetCustomerAppointmentsQuery,
	useGetAvailableTimeMutation,
	useGenerateCalenderMutation,
	useGenerateCalenderModalMutation,
	useGetAllHairStylesMutation,
	useCreateNewAppointmentMutation,
	useUpdateAppointmentMutation,
	useDeleteApppointmentMutation,
} = appointmentApiSlice;
