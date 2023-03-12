import  { useState } from "react";
import AppointmentForm from "../features/dashboard/AppointmentForm";
import { useDeleteApppointmentMutation } from "../features/appointments/appointmentApiSlice";

interface  HairStyle {
	name: string;
    price: string;
    hairStyleId: string;
	createdAt:string;
	updatedAt: string;
}

interface AppointmentInfoProps {
    setAppointmentInfoModal: (status:boolean)=> void;
    hairStyle: HairStyle[];
    currentAppointmentDate: {
        appointmentInfo: {
            date: string;
            time: string;
            appointmentId: string;
            hairStyleId: string;
        }
    }
}
const AppointmentInfo = ({
	setAppointmentInfoModal,
	hairStyle,
	currentAppointmentDate,
}:AppointmentInfoProps) => {
	
	const price = hairStyle?.find(
		(style:HairStyle) =>
			style?.hairStyleId ===
			currentAppointmentDate?.appointmentInfo?.hairStyleId
	)?.price;
	const style = hairStyle?.find(
		(style:HairStyle) =>
			style?.hairStyleId ===
			currentAppointmentDate?.appointmentInfo?.hairStyleId
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
			console.log(result, "RESULT FROM DELETING!!!!!!");
		} catch (error) {
			console.error(error);
		}
	}

	let content;
	if (reschedule) {
		content = (
			<>
				<div className="flex justify-between">
					<div className="basis-1/4"></div>
					<h3 className="basis-3/6 border-2 text-center capitalize">
						update appointment
					</h3>
					<button
						onClick={() => setAppointmentInfoModal(false)}
						className="basis-1/4"
					>
						close modal
					</button>
				</div>
				<AppointmentForm
					previosData={{
						hairStyleId:
							currentAppointmentDate.appointmentInfo.hairStyleId,
						date: currentAppointmentDate.appointmentInfo.date,
						time: currentAppointmentDate.appointmentInfo.time.slice(
							0,
							5
						),
						appointmentId:
							currentAppointmentDate.appointmentInfo
								.appointmentId,
					}}
				/>
			</>
		);
	} else if (fetchSuccess) {
		content = (
			<div>
				<h2>{fetchSuccess}</h2>
				<button
					onClick={() => {
						console.log("closing");
						setDeleteModal(false);
						setAppointmentInfoModal(false);
					}}
				>
					close
				</button>
			</div>
		);
	} else if (deleteModal) {
		content = (
			<div>
				<h2>are you sure you want to cancel appointment ? </h2>
				<button
					className="bg-red-600 text-white
			"
					onClick={() =>
						handleDeleteAppointment(
							currentAppointmentDate?.appointmentInfo
								?.appointmentId
						)
					}
				>
					cancel appointment
				</button>
			</div>
		);
	} else {
		content = (
			<>
				<div className="flex justify-between">
					<div className="basis-1/4"></div>
					<h3 className="basis-3/6 border-2 text-center capitalize">
						appointment info
					</h3>
					<button
						onClick={() => setAppointmentInfoModal(false)}
						className="basis-1/4"
					>
						close modal
					</button>
				</div>
				<div>
					<div>
						style:
						{style}
					</div>
					<div>price: {price}</div>
					<div>
						date:
						{currentAppointmentDate?.appointmentInfo?.date}
					</div>
					<div>
						time:{" "}
						{currentAppointmentDate?.appointmentInfo?.time.slice(
							0,
							5
						)}
					</div>
				</div>
				<div className="flex justify-between">
					<span onClick={() => setReschedule(true)}>reschedule</span>
					<span onClick={() => setDeleteModal(true)}>
						cancel appointment
					</span>
				</div>
			</>
		);
	}
	return (
		<div className="border-2  border-yellow-300 bg-slate-50 relative z-10 w-11/12 md:w-9/12 lg:w-1/2 mx-auto">
			{content}
		</div>
	);
};

export default AppointmentInfo;
