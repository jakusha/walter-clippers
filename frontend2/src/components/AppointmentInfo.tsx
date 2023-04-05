import  { useState } from "react";
import AppointmentForm from "../features/dashboard/AppointmentForm";
import { useDeleteApppointmentMutation } from "../features/appointments/appointmentApiSlice";
import confetti from "../assets/Confetti.png"

interface  HairStyle {
	name: string;
    price: string;
    hairStyleId: string;
	createdAt:string;
	updatedAt: string;
}

interface CurrentAppointmentDate {
	day?: string;
	appointment?:boolean;		
	appointmentInfo: {
		date: string;
		time: string;
		appointmentId: string;
		hairStyleId: string;
	}[];
	passedCurrentDate?: boolean;
}


interface AppointmentInfoProps {
    setAppointmentInfoModal: (status:boolean)=> void;
    hairStyle: HairStyle[];
    currentAppointmentDate: CurrentAppointmentDate;
}
const AppointmentInfo = ({
	setAppointmentInfoModal,
	hairStyle,
	currentAppointmentDate,
}:AppointmentInfoProps) => {
	// console.log(currentAppointmentDate, "Current Appointment!!!!!")
	const price = hairStyle?.find(
		(style:HairStyle) =>
			style?.hairStyleId ===
			currentAppointmentDate?.appointmentInfo[0]?.hairStyleId
	)?.price;
	const style = hairStyle?.find(
		(style:HairStyle) =>
			style?.hairStyleId ===
			currentAppointmentDate?.appointmentInfo[0]?.hairStyleId
	)?.name;
	const [reschedule, setReschedule] = useState(false);
	const [deleteApppointment] = useDeleteApppointmentMutation();
	const [deleteModal, setDeleteModal] = useState(false);
	const [fetchSuccess, setFetchSuccess] = useState();
	async function handleDeleteAppointment(appointmentId:string) {
		try {
			const result = await deleteApppointment(appointmentId).unwrap();

			if (result.message) {
				setFetchSuccess(result.message);
			}
			// console.log(result, "RESULT FROM DELETING!!!!!!");
		} catch (error) {
			console.error(error);
		}
	}

	let content;
	if (reschedule) {
		content = (
			<div className="h-[90vh]">
				<div className="  bg-slate-50 relative z-10  p-2 h-full overflow-y-scroll sm:w-4/6 mx-auto md:max-w-lg">
				<div >

					<h3 className="basis-3/6  capitalize text-xl lg:text-2xl text-center pt-6">
						update appointment
					</h3>
					<button
						onClick={() => setAppointmentInfoModal(false)}
						className="basis-1/4 p-1 absolute top-0 right-0"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="ionicon w-10 h-10 text-red-400" viewBox="0 0 512 512"><title>Close</title><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M368 368L144 144M368 144L144 368"/></svg>
					</button>
				</div>
				<AppointmentForm
					previosData={{
						hairStyleId:
							currentAppointmentDate.appointmentInfo[0].hairStyleId,
						date: currentAppointmentDate.appointmentInfo[0].date,
						time: currentAppointmentDate.appointmentInfo[0].time.slice(
							0,
							5
						),
						appointmentId:
							currentAppointmentDate.appointmentInfo[0]
								.appointmentId,
					}}
				/>
				</div>
			</div>
		);
	} else if (fetchSuccess) {
		content = (
			<div className="bg-slate-50 relative z-10 p-2 sm:w-4/6 mx-auto md:max-w-lg py-10 text-center">
				<button
						onClick={() => setAppointmentInfoModal(false)}
						className="basis-1/4 p-1 absolute top-0 right-0"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="ionicon w-10 h-10 text-red-400" viewBox="0 0 512 512"><title>Close</title><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M368 368L144 144M368 144L144 368"/></svg>
					</button>
				<img src={confetti} alt="confetti image" className="w-30 h-30 mx-auto mb-10"/>
				<p className="text-xl capitalize">{fetchSuccess}</p>
			</div>
			
		);
	} else if (deleteModal) {
		content = (
			<div className="bg-slate-50 relative z-10 p-2 sm:w-4/6 mx-auto md:max-w-lg pt-10 text-center">
			<div>
			<div
						onClick={() => setAppointmentInfoModal(false)}
						className="basis-1/4 p-1 absolute top-0 right-0 cursor-pointer"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="ionicon w-10 h-10 text-red-400" viewBox="0 0 512 512"><title>Close</title><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M368 368L144 144M368 144L144 368"/></svg>
					</div>
				<h2>are you sure you want to cancel appointment ? </h2>
				<button
					className="bg-red-600 text-white p-2 px-4 my-2 cursor-pointer
			"
					onClick={() =>
						handleDeleteAppointment(
							currentAppointmentDate?.appointmentInfo[0]
								?.appointmentId
						)
					}
				>
					cancel appointment
				</button>
			</div>
			</div>

		);
	} else {
		content = (
			<div className="bg-slate-50 relative z-10 p-2 sm:w-4/6 mx-auto md:max-w-lg">
				<div >

					<h3 className="basis-3/6 capitalize text-xl lg:text-2xl text-center pt-10">
						appointment info
					</h3>
					<button
						onClick={() => setAppointmentInfoModal(false)}
						className="basis-1/4 p-1 absolute top-0 right-0"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="ionicon w-10 h-10 text-red-400" viewBox="0 0 512 512"><title>Close</title><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M368 368L144 144M368 144L144 368"/></svg>
					</button>
				</div>
				<div className="p-4 capitalize">
					<div className="flex">
						<span className="text-lg  w-20">style:</span>
						<span className=" ">{style}</span>
					</div>
					<div className="flex">
						<span className="text-lg  w-20">price:</span>
						<span className="">{price}</span>
					</div>
					<div className="flex">
						<span className="text-lg  w-20">date:</span>
						<span className="">{currentAppointmentDate?.appointmentInfo[0]?.date}</span>
					</div>
					<div className="flex">
						<span className="text-lg  w-20">time:</span>
						<span className="">{currentAppointmentDate?.appointmentInfo[0]?.time.slice(
							0,
							5
						)}</span>
					</div>
				</div>
				<div className="flex justify-between p-4">
					<span onClick={() => setReschedule(true)} className="bg-blue-4 text-white-2  flex items-center justify-center p-2 cursor-pointer">reschedule</span>
					<span onClick={() => setDeleteModal(true)} className="bg-red-500 text-white p-2 cursor-pointer">
						cancel appointment
					</span>
				</div>
			</div>
		);
	}
	return (
		<div>
			{content}
		</div>
	);
};

export default AppointmentInfo;
