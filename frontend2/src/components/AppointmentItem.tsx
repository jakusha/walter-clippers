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
		<div>
			{appointment?.date} {style}{" "}
			<span
				onClick={() => {
					console.log(appointment);
					let data:any = appointment 
					setCurrentAppointmentDate({appointmentInfo: [{...data}]});
					setAppointmentInfoModal(true);
				}}
			>
				details
			</span>
		</div>
	);
};

export default AppointmentItem;
