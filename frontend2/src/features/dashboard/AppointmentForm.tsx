import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
	useCreateNewAppointmentMutation,
	useUpdateAppointmentMutation,
	useGetAvailableTimeMutation,
	HairStyle,
	useGetAllHairStylesQuery,
} from "../appointments/appointmentApiSlice";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import CalenderInput from "../../components/CalenderInput";
import TimeInput from "../../components/TimeInput";
import { DateTime } from "luxon";
import { schema } from "../../joiValidations/createAppointment";
import { selectAuthCustomer } from "../auth/authSlice";
import confetti from "../../assets/Confetti.png"

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


interface Message {
	type: string;
	value: string;
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
	const [getAvailableTime, { data: timeData, isLoading: timeLoading }] =
		useGetAvailableTimeMutation();

	
	const {data:hairData} = useGetAllHairStylesQuery();

	console.log(hairData, "HAIR DATA");
	const [createNewAppointment] = useCreateNewAppointmentMutation();
	const [updateAppointment] = useUpdateAppointmentMutation();
	const [message, setMessage] = useState<Message>({type: "normal", value: ""})
	const [fetchSuccess, setFetchSuccess] = useState();
	const [previousDate, setPreviousDate] = useState("");

	useEffect(() => {
		console.log("rendering here!!!!!11")
		const dateObj = new Date(formData?.date);
		const newDate = DateTime.fromJSDate(dateObj).toISODate();
		if(previousDate !== newDate) {
			getAvailableTime(newDate);
		}
		setPreviousDate(newDate)

	}, [formData, getAvailableTime]);

	useEffect(() => {
		const errorTimeout = setTimeout(() => {
			setMessage({type: "normal", value: ""})
		}, 3000);

		return () => clearTimeout(errorTimeout);
	}, [message.type]);
	// console.log(hairData?.hairStyles, "DROPDPWN VAUESSS!!!!!");
	const hairStyleDropDown = hairData?.hairStyles?.map((hairstyle: {name: string, price: string, hairStyleId: string}) => (
		<option value={hairstyle.hairStyleId} key={uuidv4()}>
			{hairstyle.name} - {hairstyle.price}
		</option>
	));


	function getHairStylePrice(hairId: string):null|HairStyle {
		console.log(hairId, "HAIR ID INFOOO!!!!!!!!!!!!!1");
		console.log(hairData);
		if (hairId) {
			const result:any = hairData?.hairStyles?.find(
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
			setMessage({type: "error", value: error.message})
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
						
						setMessage({type: "error", value: result?.error});
					} else {
						setFetchSuccess(result?.message);
					}
					console.log(result, "RESULT FROM UPDATE")
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
						setMessage(result.error);
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
	console.log(timeLoading, "TIME IS LOADING")

	if (fetchSuccess) {
		//todo: success modal
		content = (
			<div className="grid place-content-center gap-2 pt-4">
				<img src={confetti} alt="confetti image" className="w-30 h-30 mx-auto mb-10"/>
				<p className="text-xl capitalize">{fetchSuccess}</p>
			</div>
		);
	} else {
		content = (
			<>
				<p className={`text-red-500 text-base capitalize text-center ${message.value && 'border-2 p-2 bg-red-200 my-4'} `}>{message.value}</p>
				
				<form onSubmit={handleSubmit} className={`${message.type === "error" ? "border-red-800 border-2": ""}`}>
					<div className="flex flex-col gap-2 p-2 pt-8">
						<div className="flex">
							<label htmlFor="hairStyleId" className="text-lg capitalize w-20">style:</label>
							<select
								onChange={handlehairStyle}
								id="hairStyleId"
								value={formData.hairStyleId}
								className="w-full capitalize py-1"
							>
								<option value="">Select...</option>
								{hairStyleDropDown}
							</select>
						</div>
						<div className="flex">
							<span className="text-lg capitalize w-20">price:</span>
							<span className="border-2 border-blue-4 px-2 w-full py-1">
								{getHairStylePrice(formData.hairStyleId)?.price}
							</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-lg capitalize w-20">date:</span>
							<div className="">
								<CalenderInput setCurrentDate={handleCalender} formData={formData}/>
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-lg capitalize w-20">time:</span>
							<TimeInput timeData={timeData} handleTime={handleTime} formData={formData}/>
						</div>
					</div>
					<button className={` text-white-2  mx-auto flex items-center justify-center p-2 px-4 ${message.type === "error" ? "animate-shake bg-red-600 text-white": "bg-blue-4"}`}>confirm</button>
				</form>
			</>
		);
	}
	return <>{content}</>;
};

export default AppointmentForm;
