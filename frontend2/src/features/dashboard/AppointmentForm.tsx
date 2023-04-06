import { ChangeEvent, FormEvent, useEffect, useState } from "react";
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
import confetti from "../../assets/Confetti.png";
import { usePaystackPayment, PaystackButton } from "react-paystack";
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

const AppointmentForm = ({
	currentDate,
	previosData = null,
}: AppointmentFormProp) => {
	const [config, setConfig] = useState({});
	const customer = useSelector(selectAuthCustomer);
	const initializePayment = usePaystackPayment({
		reference: new Date().getTime().toString(),
		email: "aaronebube123@gmail.com",
		amount: 20000, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
		publicKey: "pk_test_a828faee19c13415169bd229e73b3d1b89dd4c3a",
	});

	const [formData, setFormData] = useState<FormDataState>(
		(): FormDataState => {
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
		}
	);
	const [getAvailableTime, { data: timeData, isLoading: timeLoading }] =
		useGetAvailableTimeMutation();

	const { data: hairData } = useGetAllHairStylesQuery();

	// console.log(hairData, "HAIR DATA");
	const [createNewAppointment, createStatus] =
		useCreateNewAppointmentMutation();
	const [updateAppointment, status] = useUpdateAppointmentMutation();
	const [message, setMessage] = useState<Message>({
		type: "normal",
		value: "",
	});
	const [fetchSuccess, setFetchSuccess] = useState();
	const [previousDate, setPreviousDate] = useState("");
	const [validForm, setValidForm] = useState(null);

	useEffect(() => {
		// console.log("rendering here!!!!!11")
		const dateObj = new Date(formData?.date);
		const newDate = DateTime.fromJSDate(dateObj).toISODate();
		if (previousDate !== newDate) {
			getAvailableTime(newDate);
		}
		setPreviousDate(newDate);
	}, [formData, getAvailableTime]);

	useEffect(() => {
		const errorTimeout = setTimeout(() => {
			setMessage({ type: "normal", value: "" });
		}, 3000);

		return () => clearTimeout(errorTimeout);
	}, [message.type]);
	// console.log(hairData?.hairStyles, "DROPDPWN VAUESSS!!!!!");
	const hairStyleDropDown = hairData?.hairStyles?.map(
		(hairstyle: { name: string; price: string; hairStyleId: string }) => (
			<option value={hairstyle.hairStyleId} key={uuidv4()}>
				{hairstyle.name} - {hairstyle.price}
			</option>
		)
	);

	function getHairStylePrice(hairId: string): null | HairStyle {
		// console.log(hairId, "HAIR ID INFOOO!!!!!!!!!!!!!1");
		// console.log(hairData);
		if (hairId) {
			const result: any = hairData?.hairStyles?.find(
				(hair: HairStyle) => hair.hairStyleId === hairId
			);
			return result;
		} else {
			return null;
		}
	}

	function handlehairStyle(
		e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
	) {
		setFormData({
			...formData,
			hairStyleId: e.target.value,
		});
	}

	function handleCalender(date: string) {
		setFormData({
			...formData,
			date: date,
		});
	}

	function handleTime(time: string) {
		setFormData({
			...formData,
			time: time,
		});
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		// pk_test_a828faee19c13415169bd229e73b3d1b89dd4c3a
		// console.log(formData, "DATA FROM FORM!!!!11");
		const dateObj = new Date(formData.date);
		const newDate = DateTime.fromJSDate(dateObj).toISODate();
		// console.log(newDate, "DATEEEEEE!!!!!!");
		const { hairStyleId, time } = formData;
		const { value, error } = schema.validate({
			hairStyleId: hairStyleId.toString(),
			time: time.toString().slice(0, 5),
			date: newDate.toString(),
		});

		// console.log(value, "VALUEESSSS!!!!!!!!!!");

		if (error) {
			setMessage({ type: "error", value: error.message });
			// console.log(error, "ERROR FROM VALIDATION!!!!!!!");
		} else {
			setValidForm(value);
			try {
				if (previosData) {
					const result: any = await updateAppointment({
						appointmentId: previosData.appointmentId,
						body: { ...value, custId: customer?.custId },
					}).unwrap();
					if (result?.error) {
						setMessage({ type: "error", value: result?.error });
					} else {
						setFetchSuccess(result?.message);
					}
				}
			} catch (error) {
				console.error(error, "An ERror occured");
			}
		}
	}

	let content;

	let buttonEl;

	if (status?.isLoading) {
		buttonEl = (
			<button
				className={`bg-blue-4 text-white
		p-2 px-8 text-xl my-4 font-semibold  mx-auto block w-max flex gap-2`}
			>
				<svg
					className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				loading...
			</button>
		);
	} else {
		buttonEl = (
			<button
				className={` text-white-2  mx-auto flex items-center justify-center p-2 px-4 ${
					message.type === "error"
						? "animate-shake bg-red-600 text-white"
						: "bg-blue-4"
				}`}
			>
				confirm
			</button>
		);
	}

	let paymentBtn = (value: any) => {
		if (createStatus?.isLoading) {
			return (
				<button
					className={`bg-blue-4 text-white
		p-2 px-8 text-xl my-4 font-semibold  mx-auto block w-max flex gap-2`}
				>
					<svg
						className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					loading...
				</button>
			);
		} else {
			return (
				<PaystackButton
					{...value}
					className="bg-blue-4 text-white p-4 mx-auto w-30 block my-4"
				/>
			);
		}
	};

	if (fetchSuccess) {
		//todo: success modal
		content = (
			<div className="grid place-content-center gap-2 pt-4">
				<img
					src={confetti}
					alt="confetti image"
					className="w-30 h-30 mx-auto mb-10"
				/>
				<p className="text-xl capitalize">{fetchSuccess}</p>
			</div>
		);
	} else if (validForm && !previosData) {
		let value = {
			email: customer?.email,
			amount:
				parseInt(getHairStylePrice(validForm.hairStyleId)?.price) * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
			publicKey: "pk_test_a828faee19c13415169bd229e73b3d1b89dd4c3a",
			text: "Pay now",
			onSuccess: (payment: any) => {
				// console.log({...validForm, payment},  "looking forward to seeeing you look good")
				// console.log(payment,)

				async function veifyPamentAppointment() {
					try {
						const result = await createNewAppointment({
							custId: customer?.custId,
							body: { ...validForm, payment },
						}).unwrap();

						if (result.error) {
							setMessage(result.error);
						} else {
							setFetchSuccess(result.message);
						}
						// console.log(result, "NEW APPOINTMENT!!!!1111");
					} catch (error) {
						alert("an error occured");
					}
				}

				veifyPamentAppointment();
			},
			onClose: () => {},
		};

		// console.log(validForm)

		content = (
			<div>
				<h2 className="text-xl font-semibold capitalize text-center">
					pay for haircut
				</h2>
				{paymentBtn(value)}
			</div>
		);
	} else {
		content = (
			<>
				<p
					className={`text-red-500 text-base capitalize text-center ${
						message.value && "border-2 p-2 bg-red-200 my-4"
					} `}
				>
					{message.value}
				</p>

				<form
					onSubmit={handleSubmit}
					className={`${
						message.type === "error"
							? "border-red-800 border-2"
							: ""
					}`}
				>
					<div className="flex flex-col gap-2 p-2 pt-8">
						<div className="flex">
							<label
								htmlFor="hairStyleId"
								className="text-lg capitalize w-20"
							>
								style:
							</label>
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
						<div className="flex ">
							<span className="text-lg capitalize w-20">
								price:
							</span>
							<span className="border-2 border-blue-4 px-2 w-full py-1 cursor-not-allowed">
								{getHairStylePrice(formData.hairStyleId)?.price}
							</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-lg capitalize w-20">
								date:
							</span>
							<div className="">
								<CalenderInput
									setCurrentDate={handleCalender}
									formData={formData}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-lg capitalize w-20">
								time:
							</span>
							{timeLoading ? (
								<div className="h-[20vh] bg-slate-200 animate-pulse border-2 border-blue-4"></div>
							) : (
								<TimeInput
									timeData={timeData}
									handleTime={handleTime}
									formData={formData}
								/>
							)}
						</div>
					</div>
					{buttonEl}
				</form>
			</>
		);
	}
	return <>{content}</>;
};

export default AppointmentForm;
