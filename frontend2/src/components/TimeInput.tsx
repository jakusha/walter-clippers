import React from "react";
import { v4 as uuidv4 } from "uuid";



interface  TimeData {
    times: [string, string];
};
interface TimeInputProp {
    timeData: TimeData;
    handleTime: (time: string)=> void;
}

const TimeInput = ({ timeData, handleTime }:TimeInputProp) => {
	console.log(timeData?.times);
	let timeContent =
		timeData &&
		Object.entries(timeData?.times).map((time: string[]) => (
			<div
				className={`border-2 border-red-100 p-4 grid place-content-center ${
					time[1] ? "cursor-pointer" : "opacity-25 cursor-not-allowed"
				}`}
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
		<div className="border-2 border-blue-300 grid grid-cols-6 grid-rows-6">
			{timeContent}
		</div>
	);
};

export default TimeInput;
