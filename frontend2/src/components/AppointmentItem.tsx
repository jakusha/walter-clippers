import { HairStyle } from "../features/appointments/appointmentApiSlice";

interface Appointment {
	date?: string;
	time?: string;
	appointmentId?: string;
	hairStyleId?: string;
	completed?: boolean
}

interface  currentAppointmentDate {
	appointmentInfo: {
		date: string;
		time: string;
		appointmentId: string;
		hairStyleId: string;
		completed: boolean
	}
}

interface AppointmentItemProp {
	appointment: Appointment;
	hairStyle: HairStyle[];
	setCurrentAppointmentDate: (value: currentAppointmentDate) => void;
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
					let data = { appointmentInfo: appointment } as currentAppointmentDate
					setCurrentAppointmentDate(data);
					setAppointmentInfoModal(true);
				}}
			>
				details
			</span>
		</div>
	);
};

export default AppointmentItem;
