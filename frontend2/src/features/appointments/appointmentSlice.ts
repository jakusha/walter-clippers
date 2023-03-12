import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const hairStyleSlice = createSlice({
	name: "hairstyle",
	initialState: { hairStyle: [] },
	reducers: {
		setHairStyles: (state, action) => {
			console.log(
				action.payload,
				"DATA FROM APPOINTMENT SLICE!!!!!!!!!11"
			);
			const { hairStyles } = action.payload;
			state.hairStyle = hairStyles;
		},
	},
});

export const { setHairStyles } = hairStyleSlice.actions;

export default hairStyleSlice.reducer;

export const selectHairStyle = (state: RootState) => state.hairstyle.hairStyle;
