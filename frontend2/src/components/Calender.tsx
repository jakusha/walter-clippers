import  { ChangeEvent, useEffect, useState } from "react";
import { getCurrentMonth, getCurrentYear, months } from "../utils/utils";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { selectAuthCustomer } from "../features/auth/authSlice";
import { isAllOf } from "@reduxjs/toolkit";


const currentYear = getCurrentYear();
const currentMonth = getCurrentMonth();

interface  currentAppointmentDate {
	day: string;
	appointment:boolean;		
	appointmentInfo: {
		date: string;
		time: string;
		appointmentId: string;
		hairStyleId: string;
	}[];
	passedCurrentDate: boolean;
	hasPassed: boolean;
}

interface CalenderProp {
	setCurrentAppointmentDate: (date: currentAppointmentDate)=> void;
	setAppointmentInfoModal: (modal: boolean)=> void;
	generateCalender: any;
	data: any;
	isLoading: boolean;
}

const Calender = ({
	setCurrentAppointmentDate,
	setAppointmentInfoModal,
	generateCalender,
	data,
	isLoading,
}: CalenderProp) => {
	const [yearInput, setYearInput] = useState(() => currentYear);
	const [monthInput, setMonthInput] = useState(() => currentMonth);

	console.log(isLoading, data, "CALENDER RESUKTSSS 111111111111");
	console.log(data, "DATA VALUUUEEEE");
	const customer = useSelector(selectAuthCustomer);

	let calenderContent;


	if(isLoading) {
		calenderContent  =  new Array(31).fill(null).map(()=><div className="animate-pulse bg-slate-200"> </div>)
	}else {
		
	calenderContent = data?.calender?.map((value: any) => (
			<div
				className={` rounded-full grid place-content-center w-10 h-10 md:w-12 md:h-12 ${
					value.appointment  && value.hasPassed === false && "bg-green-300 text-white cursor-pointer"
				} ${value.hasPassed && "text-[#cdcdcf]"} ${value.appointment  && value.hasPassed && "bg-green-200"} `}
				key={uuidv4()}
				onClick={() => {
					console.log(value, "DATE IN CALENDERRR VALUESS!!!!!!!!!!1");
					setCurrentAppointmentDate(value);
					if (value.appointment) {
						setAppointmentInfoModal(true);
					}
				}}
			>
				{value?.day}
			</div>
	));
}
	

	function next(number:number) {
		if (number < 11) {
			setMonthInput((value) => value + 1);
		} else {
			setYearInput((value) => value + 1);
			setMonthInput(0);
		}
	}

	function previous(number:number) {
		if (number > 0) {
			setMonthInput((value) => value - 1);
		} else {
			setMonthInput(11);
			setYearInput((value) => value - 1);
		}
	}

	function validPrevious() {
		//if true it is invalid  if my year or month user input is less than the current data it ias invalid
		let result =
			new Date(yearInput, monthInput) <=
			new Date(currentYear, currentMonth);
		return result;
	}

	function generateMonthDropdown() {
		console.log(currentYear, yearInput, "YEARRR!!!!!");
		console.log(months);

		let filterUnusableMonth;
		if (yearInput > currentYear) {
			filterUnusableMonth = months;
		} else {
			filterUnusableMonth = months.filter(
				(month) =>
					Number(month.num) >= Number(currentMonth) &&
					Number(yearInput) >= Number(currentYear)
			);
		}

		console.log(filterUnusableMonth);

		const calanderDropDown = filterUnusableMonth.map((month) => (
			<option value={month.num} key={uuidv4()}>
				{month.value}
			</option>
		));

		return calanderDropDown;
	}

	function handleYearChange(e:ChangeEvent<HTMLInputElement>) {
		if (Number(e.target.value) < currentYear || Number(e.target.value) > 2100) {
			setYearInput(currentYear);
		} else {
			setYearInput(Number(e.target.value));
		}
	}

	function handleMonthChange(e:ChangeEvent<HTMLSelectElement>) {
		setMonthInput(Number(e.target.value));
	}

	useEffect(() => {
		if(customer) {
			generateCalender({
				month: monthInput,
				year: yearInput,
				custid: customer.custId,
			});
		}
	}, [yearInput, monthInput, customer, generateCalender]);
	return (
		<div>
			
			<div className=" p-3 py-8 lg:py-2 flex-1 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] ">
				<div className="flex justify-between items-center px-2">
					<button
						className="p-2"
						onClick={() => previous(monthInput)}
						disabled={validPrevious()}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="ionicon w-6 h-6 md:w-8 md:h-8" viewBox="0 0 512 512"><title>Chevron Back</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M328 112L184 256l144 144"/></svg>
					</button>

					<div className="text-lg">
						<select value={monthInput} onChange={handleMonthChange}>
							{generateMonthDropdown()}
						</select>
						<input
							type={"number"}
							value={yearInput}
							min={currentYear}
							max={2100}
							onChange={handleYearChange}
						/>

						<div></div>
					</div>
					<button
						className="p-2"
						onClick={() => next(monthInput)}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="ionicon w-6 h-6 md:w-8 md:h-8" viewBox="0 0 512 512"><title>Chevron Forward</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M184 112l144 144-144 144"/></svg>
					</button>
				</div>
				<div className=" grid grid-cols-7 grid-rows-5 gap-4 md:text-lg">
					<div className="py-2 grid place-content-center font-semibold">
						Su
					</div>
					<div className="py-2 grid place-content-center font-semibold">
						Mo
					</div>
					<div className="py-2 grid place-content-center font-semibold">
						Tu
					</div>
					<div className="py-2 grid place-content-center font-semibold">
						We
					</div>
					<div className="py-2 grid place-content-center font-semibold">
						Th
					</div>
					<div className="py-2 grid place-content-center font-semibold">
						Fr
					</div>
					<div className="py-2 grid place-content-center font-semibold">
						Sa
					</div>
					{calenderContent}
				</div>
			</div>
		</div>
	);
};

export default Calender;
