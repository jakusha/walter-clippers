import React, { useState , useEffect} from "react";
import { v4 as uuidv4 } from "uuid";

interface  TimeData {
	date: string,
    times: [string, string];
};
interface TimeInputProp {
    timeData: TimeData;
    handleTime: (time: string)=> void;
	formData: FormDataState
}

interface FormDataState {
	hairStyleId: string;
	date: string;
	time: string;
	appointmentId?: string;
}

const TimeInput = ({ timeData, handleTime, formData }:TimeInputProp) => {
	
	// console.log(formData, 'FROM DATA IN TIME INPUT')
	let timeContent =
		timeData &&
		Object.entries(timeData?.times).map((time: string[]) => (
			<div
				className={`border-2 border-red-100  grid place-content-center ${
					time[1] ? "cursor-pointer" : "opacity-25 cursor-not-allowed"
				} ${formData && formData.time == time[0] && "bg-blue-4 text-white"}`}
				key={uuidv4()}
				onClick={() => {
					if (time[0]) {
						handleTime(time[0]);
					}
				}}
			>
				{parseInt(time[0])} {parseInt(time[0]) <= 11 ? "am" : "pm"}
				
			</div>
		));

	return (
		<div className="border-2 border-blue-4 grid grid-cols-3 grid-rows-5 h-80">
			{timeContent}
			
		</div>
	);
};

export default TimeInput;
