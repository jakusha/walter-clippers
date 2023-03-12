import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
	useCreateNewAppointmentMutation,
	useUpdateAppointmentMutation,
	useGetAvailableTimeMutation,
	HairStyle,
} from "../appointments/appointmentApiSlice";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import CalenderInput from "../../components/CalenderInput";
import TimeInput from "../../components/TimeInput";
import { DateTime } from "luxon";
import { schema } from "../../joiValidations/createAppointment";
import { selectAuthCustomer } from "../auth/authSlice";
import { selectHairStyle } from "../appointments/appointmentSlice";


interface AppointmentFormProp {
    currentDate?: string;
    previosData?: null | FormDataState;
}

interface FormDataState {
		hairStyleId: string;
		date: string;
		time: string;
		appointmentId?: string;
}

const AppointmentForm = ({ currentDate, previosData = null }: AppointmentFormProp) => {
	const customer = useSelector(selectAuthCustomer);

	const [formData, setFormData] = useState<FormDataState>(():FormDataState => {
		if (previosData) {
			return {
				...previosData,
			};
		}
		return {
			hairStyleId: "",
			date: currentDate as string,
			time: "",
		};
	});
	const [getAvailableTime, { data: timeData }] =
		useGetAvailableTimeMutation();

	const hairData = useSelector(selectHairStyle);
	console.log(hairData, "HAIR DATA");
	const [createNewAppointment] = useCreateNewAppointmentMutation();
	const [updateAppointment] = useUpdateAppointmentMutation();
	const [fetchError, setFetchError] = useState<null | string>();
	const [fetchSuccess, setFetchSuccess] = useState();

	useEffect(() => {
		const dateObj = new Date(formData?.date);
		const newDate = DateTime.fromJSDate(dateObj).toISODate();
		console.log(newDate);
		getAvailableTime(newDate);
	}, [formData, getAvailableTime]);

	useEffect(() => {
		const errorTimeout = setTimeout(() => {
			setFetchError(null);
		}, 3000);

		return () => clearTimeout(errorTimeout);
	}, [fetchError]);
	// console.log(hairData?.hairStyles, "DROPDPWN VAUESSS!!!!!");
	const hairStyleDropDown = hairData.map((hairstyle: {name: string, price: string, hairStyleId: string}) => (
		<option value={hairstyle.hairStyleId} key={uuidv4()}>
			{hairstyle.name} - {hairstyle.price}
		</option>
	));

	function getHairStylePrice(hairId: string):null|HairStyle {
		console.log(hairId, "HAIR ID INFOOO!!!!!!!!!!!!!1");
		console.log(hairData);
		if (hairId) {
			const result:any = hairData?.find(
				(hair:HairStyle) => hair.hairStyleId === hairId
			);
			return result;
		} else {
			return null;
		}
	}

	function handlehairStyle(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) {
		setFormData({
			...formData,
			hairStyleId: e.target.value,
		});
	}

	function handleCalender(date:string) {
		setFormData({
			...formData,
			date: date,
		});
	}

	function handleTime(time:string) {
		setFormData({
			...formData,
			time: time,
		});
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log(formData, "DATA FROM FORM!!!!11");
		const dateObj = new Date(formData.date);
		const newDate = DateTime.fromJSDate(dateObj).toISODate();
		console.log(newDate, "DATEEEEEE!!!!!!");
		const { hairStyleId, time } = formData;
		const { value, error } = schema.validate({
			hairStyleId: hairStyleId.toString(),
			time: time.toString().slice(0, 5),
			date: newDate.toString(),
		});

		console.log(value, "VALUEESSSS!!!!!!!!!!");

		if (error) {
			console.log(error, "ERROR FROM VALIDATION!!!!!!!");
		} else {
			try {
				if (previosData) {
					console.log(
						value,
						"UPDATEDATING APPOINTMENT APPOINTMENT!!!!!!!!1"
					);
					const result:any = await updateAppointment({
						appointmentId: previosData.appointmentId,
						body: { ...value, custId: customer?.custId },
					}).unwrap();

					if (result?.error) {
						setFetchError(result?.error);
					} else {
						setFetchSuccess(result?.message);
					}
					console.log(
						value,
						result,
						"UPDATING APPOINTMENT APPOINTMENT!!!!1111"
					);
				} else {
					const result = await createNewAppointment({
						custId: customer?.custId,
						body: value,
					}).unwrap();

					if (result.error) {
						setFetchError(result.error);
					} else {
						setFetchSuccess(result.message);
					}
					console.log(result, "NEW APPOINTMENT!!!!1111");
				}
			} catch (error) {
				console.log(error, "An ERror occured");
			}
		}
		console.log(value, error);
	}

	let content;

	if (fetchSuccess) {
		//todo: success modal
		content = (
			<div>
				<h2>{fetchSuccess}</h2> /
			</div>
		);
	} else {
		content = (
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="hairStyleId">style:</label>
					<select
						onChange={handlehairStyle}
						id="hairStyleId"
						value={formData.hairStyleId}
					>
						<option value="">Select...</option>
						{hairStyleDropDown}
					</select>
				</div>
				<div>
					<span>price:</span>
					<span>
						{getHairStylePrice(formData.hairStyleId)?.price}
					</span>
				</div>
				<div>
					<label htmlFor="date">date:</label>
					<div className="w-64">
						<CalenderInput setCurrentDate={handleCalender} />
					</div>
				</div>
				<div>
					<label htmlFor="time">time:</label>
					<TimeInput timeData={timeData} handleTime={handleTime} />
				</div>
				<button>confirm</button>
				{fetchError && <p className="text-red-300">{fetchError}</p>}
			</form>
		);
	}
	return <>{content}</>;
};

export default AppointmentForm;
