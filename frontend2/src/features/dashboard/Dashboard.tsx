import  { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import AppointmentInfo from "../../components/AppointmentInfo";
import Calender from "../../components/Calender";
import {
	useLazyGenerateCalenderQuery,
	useGetAllHairStylesQuery,
} from "../appointments/appointmentApiSlice";

import { useLogoutMutation } from "../auth/authApiSlice";
import { selectAuthCustomer } from "../auth/authSlice";
import { logOut } from "../auth/authSlice";
import AppointmentForm from "./AppointmentForm";
import AppointmentItem from "../../components/AppointmentItem";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";



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


export interface  HairStyle {
	name: string;
    price: string;
    hairStyleId: string;
	createdAt:string;
	updatedAt: string;
}


const Dashboard = () => {
	
	const customer = useAppSelector(selectAuthCustomer);
	const [logout] = useLogoutMutation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	
	const {data: hairStyleData} = useGetAllHairStylesQuery();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [appointmentInfoModal, setAppointmentInfoModal] = useState(false);
	const [currentAppointmentDate, setCurrentAppointmentDate] = useState({} as CurrentAppointmentDate);
	console.log(currentAppointmentDate, "");

	
	const [
		generateCalender,
		{
			data: calenderData,
			isLoading: calenderIsLoading,
			isError: calenderError,
		},
	] = useLazyGenerateCalenderQuery();

	console.log(calenderData, "CALENDER DATA!!!!!!1");

	async function handleLogout() {
		try {
			//passing this placeholder string to make linter shutup
			await logout("asd");
			console.log("LOGGED OUTT OOO");
			dispatch(logOut());
			navigate("/");
		} catch (error) {
			console.log(error, "ERROORRR IN DASHBOARD");
		}
	}

	useEffect(() => {
		console.log(currentAppointmentDate, "CUrrent Appintment date!!!!!!11");
	}, [currentAppointmentDate]);
	let content = <div>An error occured</div>;

	if (calenderIsLoading) {
		content = <div>appointments loading</div>;
	} else if (calenderError) {
		content = <div>An error occured</div>;
	} else if (calenderData) {
		content = (
			<div className="flex flex-col gap-2 mb-10">
				{calenderData?.result
					.filter(
						(appointment:any) =>
							appointment?.date >=
							new Date().toISOString().slice(0, 10)
					).map((appointment:Appointment) => (
						<AppointmentItem
							appointment={appointment}
							hairStyle={hairStyleData?.hairStyles}

							setCurrentAppointmentDate={
								setCurrentAppointmentDate
							}
							setAppointmentInfoModal={setAppointmentInfoModal}
							key={uuidv4()}
						/>
					))}
					
			</div>
		);
	} else {
		content = <div>An error occured</div>;
	}

	return (
		<div>
			<nav className="flex justify-between border-2 border-red-300 items-baseline">
				{" "}
				<span className="text-2xl">walter</span>
				<div className="flex gap-8">
					<Link to={"/history"}>history</Link>
					<button onClick={handleLogout}>Log out</button>
				</div>
			</nav>

			<h1 className="text-2xl mt-4">Welcome {customer?.username}</h1>
			<p>{customer?.email}</p>
			<div className="flex flex-col gap-8 px-3">
				<div className="">
					
					<Calender
						setCurrentAppointmentDate={setCurrentAppointmentDate}
						setAppointmentInfoModal={setAppointmentInfoModal}
						generateCalender={generateCalender}
						data={calenderData}
						isLoading={calenderIsLoading} 					/>
				</div>
				<div className="border-2 border-green-300 flex-1">
					<div>
						<div className="flex flex-col justify-between items-center">
							<h3 className="capitalize text-lg text-center font-semibold">upcoming appointments this month</h3>

							<button onClick={() => setShowModal(true)} className="border-2 border-red-100 flex items-center self-start capitalize mt-2 mb-4">
							<svg xmlns="http://www.w3.org/2000/svg" className="ionicon w-8 h-8 text-[#5f656e]" viewBox="0 0 512 512"><title>Add</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 112v288M400 256H112"/></svg>
							create new appointment
							</button>
						</div>
						{showModal &&
							createPortal(
								<div className="bg-transparent border-2 border-red-300 absolute top-0 left-0 right-0 h-screen w-screen py-10">
									<div className="border-2  border-yellow-300 bg-slate-50 relative z-10 w-11/12 md:w-9/12 lg:w-1/2 mx-auto">
										<div className="flex justify-between">
											<div className="basis-1/4"></div>
											<h3 className="basis-3/6 border-2 text-center capitalize">
												create appointment
											</h3>
											<button
												onClick={() =>
													setShowModal(false)
												}
												className="basis-1/4"
											>
												close modal
											</button>
										</div>
										<div className="mt-10">
											<AppointmentForm
												currentDate={new Date()
													.toISOString()
													.slice(0, 10)}
											/>
										</div>
									</div>
								</div>,
								document.body
							)}
						{appointmentInfoModal &&
							createPortal(
								<div className="bg-[rgba(0,0,0,.2)] fixed p-4 border-2 border-red-300 z-40 top-0 left-0 right-0 h-screen w-screen">
									<AppointmentInfo
										currentAppointmentDate={
											currentAppointmentDate
										}
										hairStyle={hairStyleData?.hairStyles}
										setAppointmentInfoModal={
											setAppointmentInfoModal
										}
									/>
								</div>,
								document.body
							)}
						{content}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
