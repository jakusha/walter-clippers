import { HairStyle } from "../features/appointments/appointmentApiSlice";

interface Appointment {
	date?: string;
	time?: string;
	appointmentId?: string;
	hairStyleId?: string;
	completed?: boolean
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


interface AppointmentItemProp {
	appointment: Appointment;
	hairStyle: HairStyle[];
	setCurrentAppointmentDate: (value: CurrentAppointmentDate) => void;
	setAppointmentInfoModal: (modal: boolean) => void;
}




const AppointmentItem = ({
	appointment,
	hairStyle,
	setCurrentAppointmentDate,
	setAppointmentInfoModal,
}: AppointmentItemProp) => {
	const style = hairStyle?.find(
		(style) => style.hairStyleId === appointment.hairStyleId
	)?.name;
	return (
		<div className="py-4 p-2 flex justify-between shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]  capitalize h-16 ">
			<span>{appointment?.date} {style} </span>{" "}
			<span
				onClick={() => {
					// console.log(appointment);
					let data:any = appointment 
					setCurrentAppointmentDate({appointmentInfo: [{...data}]});
					setAppointmentInfoModal(true);
				}}
				className='text-blue-1 cursor-pointer'
			>
				Details
			</span>
		</div>
	);
};

export default AppointmentItem;
