import React, { ChangeEvent, useEffect, useState } from "react";
import { getCurrentMonth, getCurrentYear, months } from "../utils/utils";
import { v4 as uuidv4 } from "uuid";
import { useGenerateCalenderModalMutation } from "../features/appointments/appointmentApiSlice";
import { selectAuthCustomer } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
const currentYear = getCurrentYear();
const currentMonth = getCurrentMonth();



interface FormDataState {
	hairStyleId: string;
	date: string;
	time: string;
	appointmentId?: string;
}

const CalenderInput = ({ setCurrentDate, formData  }: {setCurrentDate: (date:string)=> void, formData: FormDataState}) => {
	const customer = useSelector(selectAuthCustomer);
	const [yearInput, setYearInput] = useState(() => currentYear);
	const [monthInput, setMonthInput] = useState(() => currentMonth);
	const [generateCalender, { data, isLoading }] =
		useGenerateCalenderModalMutation();
	console.log(data, "CALENDER MAPPPP!!!!!!!!!11");
	useEffect(() => {
		if(customer) {

			generateCalender({
				month: monthInput,
				year: yearInput,
				custId: customer.custId,
			});
		}
	}, [yearInput, monthInput, generateCalender, customer?.custId]);

	function activeData (value:any, formData:FormDataState) {
		if(!formData || !value) return;
		const date = value?.date;
		let splitDate = date.split("-");
		splitDate[1] = parseInt(splitDate[1]) + 1;
		let updatedDate = splitDate.join("-")
		return new Date(updatedDate).toLocaleDateString() === new Date(formData.date).toLocaleDateString()
	}
	let calenderContent = data?.calender?.map((value:any) => (
		<div
			className={`border-2 border-red-100 p-4 grid place-content-center ${
				value.invalid
					? "opacity-25 cursor-not-allowed"
					: "cursor-pointer "
			}  ${activeData(value, formData) && "bg-blue-4 text-white"}`}
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

		console.log(new Date(yearInput, monthInput),
		new Date(currentYear, currentMonth), "date values")
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

	function handleMonthChange(e: ChangeEvent<HTMLSelectElement>) {
		setMonthInput(Number(e.target.value));
	}

	console.log(validPrevious(), "IS month valid")

	return (
		<div>
			<div className="  flex-1">
				<div className="flex justify-between px-4">
					<div
						className={`p-2 -ml-4 ${validPrevious() ? "hidden": "block"}`}
						onClick={() => previous(monthInput)}
						
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="ionicon w-6 h-6" viewBox="0 0 512 512"><title>Chevron Back</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M328 112L184 256l144 144"/></svg>
					</div>

					<h3 className="text-lg flex gap-2 mx-1">
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
					<div
						className="p-2 "
						onClick={() => next(monthInput)}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="ionicon w-6 h-6" viewBox="0 0 512 512"><title>Chevron Forward</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M184 112l144 144-144 144"/></svg>
					</div>
				</div>
				<div className="border-2 border-blue-4 grid grid-cols-7 grid-rows-6">
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

export default CalenderInput;
