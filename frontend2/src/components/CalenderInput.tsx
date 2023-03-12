import React, { useEffect, useState } from "react";
import { getCurrentMonth, getCurrentYear, months } from "../utils/utils";
import { v4 as uuidv4 } from "uuid";
import { useGenerateCalenderModalMutation } from "../features/appointments/appointmentApiSlice";
import { selectAuthCustomer } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
const currentYear = getCurrentYear();
const currentMonth = getCurrentMonth();

const CalenderInput = ({ setCurrentDate }) => {
	const customer = useSelector(selectAuthCustomer);
	const [yearInput, setYearInput] = useState(() => currentYear);
	const [monthInput, setMonthInput] = useState(() => currentMonth);
	const [generateCalender, { data, isLoading }] =
		useGenerateCalenderModalMutation();
	console.log(data, "CALENDER MAPPPP!!!!!!!!!11");
	useEffect(() => {
		generateCalender({
			month: monthInput,
			year: yearInput,
			custId: customer.custId,
		});
	}, [yearInput, monthInput, generateCalender, customer.custId]);

	let calenderContent = data?.calender?.map((value) => (
		<div
			className={`border-2 border-red-100 p-4 grid place-content-center ${
				value.invalid
					? "opacity-25 cursor-not-allowed"
					: "cursor-pointer "
			}`}
			key={uuidv4()}
			onClick={() => {
				// console.log(value, "DATE IN CALENDERRR VALUESS!!!!!!!!!!1");
				if (!value.invalid) {
					const date = value?.date;
					let splitDate = date.split("-");
					splitDate[1] = parseInt(splitDate[1]) + 1;
					let updatedDate = splitDate.join("-");
					// console.log(
					// 	value.date,
					// 	updatedDate,
					// 	"Date in clalender!!!"
					// );

					setCurrentDate(updatedDate);
				}
			}}
		>
			{value?.day}
		</div>
	));

	function next(number) {
		if (number < 11) {
			setMonthInput((value) => value + 1);
		} else {
			setYearInput((value) => value + 1);
			setMonthInput(0);
		}
	}

	function previous(number) {
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

	function handleYearChange(e) {
		if (e.target.value < currentYear || e.target.value > 2100) {
			setYearInput(currentYear);
		} else {
			setYearInput(e.target.value);
		}
	}

	function handleMonthChange(e) {
		setMonthInput(e.target.value);
	}

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
				<div className="border-2 border-blue-300 grid grid-cols-7 grid-rows-6">
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

export default CalenderInput;
