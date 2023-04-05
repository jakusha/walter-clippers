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
import confetti from "../../assets/Confetti.png"
import {usePaystackPayment, PaystackButton} from "react-paystack"
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
	const [config, setConfig] = useState({})
	const customer = useSelector(selectAuthCustomer);
	const initializePayment = usePaystackPayment({
		
			reference: (new Date()).getTime().toString(),
			email: "aaronebube123@gmail.com",
			amount: 20000, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
			publicKey: 'pk_test_a828faee19c13415169bd229e73b3d1b89dd4c3a',
		
	})
	
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

	// console.log(hairData, "HAIR DATA");
	const [createNewAppointment] = useCreateNewAppointmentMutation();
	const [updateAppointment] = useUpdateAppointmentMutation();
	const [message, setMessage] = useState<Message>({type: "normal", value: ""})
	const [fetchSuccess, setFetchSuccess] = useState();
	const [previousDate, setPreviousDate] = useState("");
	const [validForm, setValidForm] = useState(null)

	useEffect(() => {
		// console.log("rendering here!!!!!11")
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
		// console.log(hairId, "HAIR ID INFOOO!!!!!!!!!!!!!1");
		// console.log(hairData);
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
			setMessage({type: "error", value: error.message})
			// console.log(error, "ERROR FROM VALIDATION!!!!!!!");
		} else {
			setValidForm(value);
			try {
				if (previosData) {
					// console.log(
					// 	value,
					// 	"UPDATEDATING APPOINTMENT APPOINTMENT!!!!!!!!1"
					// );
					const result:any = await updateAppointment({
						appointmentId: previosData.appointmentId,
						body: { ...value, custId: customer?.custId },
					}).unwrap();

					if (result?.error) {
						
						setMessage({type: "error", value: result?.error});
					} else {
						setFetchSuccess(result?.message);
					}
					// console.log(result, "RESULT FROM UPDATE")
					// console.log(
					// 	value,
					// 	result,
					// 	"UPDATING APPOINTMENT APPOINTMENT!!!!1111"
					// );
				}
			} catch (error) {
				console.error(error, "An ERror occured");
			}
		}
		// console.log(value, error);
	}

	let content;
	// console.log(timeLoading, "TIME IS LOADING")

	if (fetchSuccess) {
		//todo: success modal
		content = (
			<div className="grid place-content-center gap-2 pt-4">
				<img src={confetti} alt="confetti image" className="w-30 h-30 mx-auto mb-10"/>
				<p className="text-xl capitalize">{fetchSuccess}</p>
			</div>
		);
	}else if(validForm) {
		let value = {
			
			email: customer?.email,
			amount: parseInt(getHairStylePrice(validForm.hairStyleId)?.price) * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
			publicKey: 'pk_test_a828faee19c13415169bd229e73b3d1b89dd4c3a',
			text: "Pay now",
			onSuccess:  (payment: any)=> {
				// console.log({...validForm, payment},  "looking forward to seeeing you look good")
				// console.log(payment,)

				async function veifyPamentAppointment() {
					try {
						const result = await createNewAppointment({
								custId: customer?.custId,
								body: {...validForm, payment},
							}).unwrap();
		
							if (result.error) {
								setMessage(result.error);
							} else {
								setFetchSuccess(result.message);
							}
						// console.log(result, "NEW APPOINTMENT!!!!1111");
					} catch (error) {
						alert("an error occured")
					}

				}

				veifyPamentAppointment()
			},
			onClose: ()=> {
				console.log('closed')
			}
		}
					  
		// console.log(validForm)
		
		content = <div>
			<h2 className="text-xl font-semibold capitalize text-center">pay for haircut</h2>
			<PaystackButton  {...value} className="bg-blue-4 text-white p-4 mx-auto w-30 block my-4"/>
		</div>
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
						<div className="flex ">
							<span className="text-lg capitalize w-20">price:</span>
							<span className="border-2 border-blue-4 px-2 w-full py-1 cursor-not-allowed">
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
							{timeLoading ?  <div className="h-[20vh] bg-slate-200 animate-pulse border-2 border-blue-4"> 

							</div>: <TimeInput timeData={timeData} handleTime={handleTime} formData={formData}/>}
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
