import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import AppointmentInfo from "../../components/AppointmentInfo";
import Calender from "../../components/Calender";
import {
	useGenerateCalenderMutation,
	useGetAllHairStylesMutation,
} from "../appointments/appointmentApiSlice";

import {
	selectHairStyle,
	setHairStyles,
} from "../appointments/appointmentSlice";
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


interface  currentAppointmentDate {
	appointmentInfo: {
		date: string;
		time: string;
		appointmentId: string;
		hairStyleId: string;
		completed: boolean
	}
}

// {
// 	"date": "2023-03-02",
// 	"time": "09:00:00",
// 	"completed": false,
// 	"cancelled": false,
// 	"appointmentId": "d61abff7-81a1-4e4a-bf37-13bb5504c8da",
// 	"custId": "219ff894-295c-4316-afc9-56933b3562a4",
// 	"hairStyleId": "b54ec33e-6ddf-4648-a464-f60ca64a2f88",
// 	"createdAt": "2023-02-28T20:52:02.244Z",
// 	"updatedAt": "2023-02-28T20:52:02.244Z"
// }

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
	const hairStyle:HairStyle[] = useAppSelector<HairStyle[]>(selectHairStyle);
	const [getAllHairStyles] = useGetAllHairStylesMutation();

	const [showModal, setShowModal] = useState<boolean>(false);
	const [appointmentInfoModal, setAppointmentInfoModal] = useState(false);
	const [currentAppointmentDate, setCurrentAppointmentDate] = useState({} as currentAppointmentDate);
	console.log(currentAppointmentDate, "");

	const [
		generateCalender,
		{
			data: calenderData,
			isLoading: calenderIsLoading,
			error: calenderError,
		},
	] = useGenerateCalenderMutation();

	console.log(calenderData, "CALENDER DATA!!!!!!1");
	useEffect(() => {
		async function fetchHairStyle() {
			if (hairStyle.length === 0) {
				try {
					//passing this placeholder string to make linter shutup
					const result:HairStyle[] = await getAllHairStyles("asd").unwrap();
					console.log(
						result,
						"RESULT FROM FETCHING HAIRSTYLE!!!!!!!!!!!!!"
					);
					dispatch(setHairStyles({ ...result }));
				} catch (error) {
					console.log("aN ERROR OCCURED IN FETCHIG Hairstyle");
				}
			}
			console.log(hairStyle, "HaISRTYLEE HAIRSTYLLEEEE!!!!!!!!!!1");
		}

		fetchHairStyle();
	}, [dispatch, getAllHairStyles, hairStyle]);

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
			<div>
				{calenderData?.result
					.filter(
						(appointment:any) =>
							appointment?.date >=
							new Date().toISOString().slice(0, 10)
					)
					.map((appointment:Appointment) => (
						<AppointmentItem
							appointment={appointment}
							hairStyle={hairStyle}

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
			<nav className="flex justify-between">
				{" "}
				<span className="text-2xl">cutzy</span>
				<div className="flex gap-8">
					<Link to={"/history"}>history</Link>
					<button onClick={handleLogout}>Log out</button>
				</div>
			</nav>

			<h1>Welcome {customer?.username}</h1>
			<p>{customer?.email}</p>
			<div className="flex">
				<div className="border-2 border-yellow-200">
					
					<Calender
						setCurrentAppointmentDate={setCurrentAppointmentDate}
						setAppointmentInfoModal={setAppointmentInfoModal}
						generateCalender={generateCalender}
						data={calenderData}
						isLoading={calenderIsLoading} providedCalenderContent={undefined}					/>
				</div>
				<div className="border-2 border-green-300 flex-1">
					<div>
						<div className="flex justify-between">
							<h3>upcoming appointments this month</h3>
							<button onClick={() => setShowModal(true)}>
								Create appointment
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
								<div className="bg-transparent border-2 border-red-300 absolute top-0 left-0 right-0 h-screen w-screen py-10">
									<AppointmentInfo
										currentAppointmentDate={
											currentAppointmentDate
										}
										hairStyle={hairStyle}
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
