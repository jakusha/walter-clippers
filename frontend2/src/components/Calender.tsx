import React, { ChangeEvent, useEffect, useState } from "react";
import { getCurrentMonth, getCurrentYear, months } from "../utils/utils";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { selectAuthCustomer } from "../features/auth/authSlice";

//green (appointment date)  orange (past appointment date)
const currentYear = getCurrentYear();
const currentMonth = getCurrentMonth();

interface  currentAppointmentDate {
	appointmentInfo: {
		date: string;
		time: string;
		appointmentId: string;
		hairStyleId: string;
		completed: boolean
	}
}

interface CalenderProp {
	setCurrentAppointmentDate: (date: currentAppointmentDate)=> void;
	providedCalenderContent: undefined | unknown[];
	setAppointmentInfoModal: (modal: boolean)=> void;
	generateCalender: any;
	data: any;
	isLoading: boolean;
}
const Calender = ({
	setCurrentAppointmentDate,
	providedCalenderContent,
	setAppointmentInfoModal,
	generateCalender,
	data,
	isLoading,
}: CalenderProp) => {
	const [yearInput, setYearInput] = useState(() => currentYear);
	const [monthInput, setMonthInput] = useState(() => currentMonth);
	// const [calenderValues, setCalenderValues] = useState([]);

	console.log(isLoading, data, "CALENDER RESUKTSSS 111111111111");
	console.log(data, "DATA VALUUUEEEE");
	const customer = useSelector(selectAuthCustomer);

	let calenderContent;
	if (providedCalenderContent) {
		calenderContent = providedCalenderContent.map((value:any) => (
			<div
				className={`border-2 border-red-100 p-4 grid place-content-center ${
					value.appointment && "bg-green-500"
				}`}
				key={uuidv4()}
				onClick={() => {
					console.log(value, "DATE IN CALENDERRR VALUESS!!!!!!!!!!1");
					setCurrentAppointmentDate(value);
					setAppointmentInfoModal(true);
				}}
			>
				{value?.day}
			</div>
		));
	} else {
		
		calenderContent = data?.calender?.map((value: any) => (
			<div
				className={`border-2 border-red-100 p-4 grid place-content-center ${
					value.appointment && "bg-green-300 text-white"
				} ${value.passedCurrentDate && "bg-orange-200 text-white"}`}
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
			<div className="  border-red-500 border-8 flex-1">
				<div className="flex justify-between px-4">
					<button
						className="bg-blue-100 p-2"
						onClick={() => previous(monthInput)}
						disabled={validPrevious()}
					>
						left
					</button>

					<h3 className="text-lg">
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
					</h3>
					<button
						className="bg-blue-100 p-2"
						onClick={() => next(monthInput)}
					>
						right
					</button>
				</div>
				<div className="border-2 border-blue-300 grid grid-cols-7 grid-rows-5">
					<div className="border-2 border-red-100 p-4 grid place-content-center">
						Sun
					</div>
					<div className="border-2 border-red-100 p-4 grid place-content-center">
						Mon
					</div>
					<div className="border-2 border-red-100 p-4 grid place-content-center">
						Tue
					</div>
					<div className="border-2 border-red-100 p-4 grid place-content-center">
						Wed
					</div>
					<div className="border-2 border-red-100 p-4 grid place-content-center">
						Thurs
					</div>
					<div className="border-2 border-red-100 p-4 grid place-content-center">
						Fri
					</div>
					<div className="border-2 border-red-100 p-4 grid place-content-center">
						Sat
					</div>
					{calenderContent}
				</div>
			</div>
		</div>
	);
};

export default Calender;
