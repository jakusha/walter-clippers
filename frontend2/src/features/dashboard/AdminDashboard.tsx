import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";

import Calender from "../../components/Calender";
import {
	useLazyGenerateCalenderQuery,
	useGetAllHairStylesQuery,
} from "../appointments/appointmentApiSlice";

import { useLogoutMutation } from "../auth/authApiSlice";
import { selectAuthCustomer } from "../auth/authSlice";
import { logOut } from "../auth/authSlice";
import AppointmentItem from "../../components/AppointmentItem";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import AdminAppointmentInfo from "../../components/AdminAppointmentInfo";
import scissors from "../../assets/scissors.png";

interface Appointment {
	date?: string;
	time?: string;
	appointmentId?: string;
	hairStyleId?: string;
	completed?: boolean;
}

interface CurrentAppointmentDate {
	day?: string;
	appointment?: boolean;
	appointmentInfo: {
		date: string;
		time: string;
		appointmentId: string;
		hairStyleId: string;
		Customer?: any;
	}[];
	passedCurrentDate?: boolean;
}

export interface HairStyle {
	name: string;
	price: string;
	hairStyleId: string;
	createdAt: string;
	updatedAt: string;
}

const AdminDashboard = () => {
	const customer = useAppSelector(selectAuthCustomer);
	const [logout] = useLogoutMutation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const { data: hairStyleData } = useGetAllHairStylesQuery();
	const [appointmentInfoModal, setAppointmentInfoModal] = useState(false);
	const [currentAppointmentDate, setCurrentAppointmentDate] = useState(
		{} as CurrentAppointmentDate
	);
	// console.log(currentAppointmentDate, "");

	useEffect(() => {
		if (appointmentInfoModal) {
			document.body.style.position = "fixed";
			document.body.style.top = `-${window.scrollY}px`;
		}

		return () => {
			const scrollY = document.body.style.top;
			document.body.style.position = "";
			document.body.style.top = "";
			window.scrollTo(0, parseInt(scrollY || "0") * -1);
		};
	}, [ appointmentInfoModal]);

	const [
		generateCalender,
		{
			data: calenderData,
			isLoading: calenderIsLoading,
			isError: calenderError,
		},
	] = useLazyGenerateCalenderQuery();

	// console.log(calenderData, "CALENDER DATA!!!!!!1");

	async function handleLogout() {
		try {
			//passing this placeholder string to make linter shutup
			await logout("asd");
			// console.log("LOGGED OUTT OOO");
			dispatch(logOut());
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	}

	
	let content = <div>An error occured</div>;

	if (calenderIsLoading) {
		content = <div>appointments loading</div>;
	} else if (calenderError) {
		content = <div>An error occured</div>;
	} else if (calenderData) {
		content = (
			<div className="grid grid-cols-1 auto-rows-max xl:grid-cols-2 row-auto gap-2 mb-10 lg:text-lg h-[40vh] overflow-auto scrollbar:!w-1.5 scrollbar:!h-1.5 scrollbar:bg-transparent scrollbar-track:!bg-slate-97 scrollbar-thumb:!rounded scrollbar-thumb:!bg-slate-300 scrollbar-track:!rounded dark:scrollbar-track:!bg-slate-500/[0.16] dark:scrollbar-thumb:!bg-slate-500/50 max-h-96 lg:supports-scrollbars:pr-2">
				{calenderData?.result
					.filter(
						(appointment: any) =>
							appointment?.date >=
							new Date().toISOString().slice(0, 10)
					)
					.map((appointment: Appointment) => (
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
		<div className="relative max-w-screen-2xl mx-auto ">
			<nav className="flex justify-between  border-b-2 border-blue-4 items-center px-2 md:px-14 overflow-hidden  w-full">
				<span className="capitalize text-2xl cursor-pointer  flex items-center">
					walter
					<img
						src={scissors}
						alt="image of scissors"
						className="pt-2 h-14 w-14"
					/>
				</span>
				<div className="flex gap-2 lg:gap-4 text-base  capitalize">
					<Link to={"/history"}>history</Link>
					<Link to={"/hairstyle"}>new Hairstyle</Link>

					<button onClick={handleLogout} className="text-blue-3">Log out</button>
				</div>
			</nav>
			<div className="px-3 lg:px-12">
			<h1 className="text-xl md:text-2xl mt-4 font-bold">
				Admin Dashboard Welcome {customer?.username}
			</h1>
			<p>{customer?.email}</p>
			<div className="flex flex-col lg:flex-row gap-8 pt-5">
				<div className="">
					<Calender
						setCurrentAppointmentDate={setCurrentAppointmentDate}
						setAppointmentInfoModal={setAppointmentInfoModal}
						generateCalender={generateCalender}
						data={calenderData}
						isLoading={calenderIsLoading}
					/>
				</div>
				<div className="flex-1">
					<div>
						<div className="flex flex-col justify-between items-center">
							<h3 className="capitalize text-lg md:text-2xl text-center font-semibold">
								upcoming appointments this month
							</h3>
						</div>

						{appointmentInfoModal &&
							createPortal(
								<div className="bg-[rgba(0,0,0,.2)] border-2 absolute top-0 left-0 right-0 h-screen w-screen p-4 py-6 z-40">
									<AdminAppointmentInfo
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
		</div>
	);
};

export default AdminDashboard;
