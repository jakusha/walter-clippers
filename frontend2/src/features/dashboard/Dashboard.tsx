import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import AppointmentInfo from "../../components/AppointmentInfo";
import Calender from "../../components/Calender";
import {
	useLazyGenerateCalenderQuery,
	useGetAllHairStylesQuery,
} from "../appointments/appointmentApiSlice";
import scissors from "../../assets/scissors.png";
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

const Dashboard = () => {
	const customer = useAppSelector(selectAuthCustomer);
	const [logout] = useLogoutMutation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { data: hairStyleData } = useGetAllHairStylesQuery();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [appointmentInfoModal, setAppointmentInfoModal] = useState(false);
	const [currentAppointmentDate, setCurrentAppointmentDate] = useState(
		{} as CurrentAppointmentDate
	);
	// console.log(currentAppointmentDate, "");
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
			console.error(error);
		}
	}

	useEffect(() => {
		if (appointmentInfoModal || showModal) {
			document.body.style.position = "fixed";
			document.body.style.top = `-${window.scrollY}px`;
		}

		return () => {
			const scrollY = document.body.style.top;
			document.body.style.position = "";
			document.body.style.top = "";
			document.body.style.left = "0px"
			document.body.style.right = "0px"
			window.scrollTo(0, parseInt(scrollY || "0") * -1);
		};
	}, [showModal, appointmentInfoModal]);

	let content = <div>An error occured</div>;

	if (calenderIsLoading) {
		content = <div>appointments loading</div>;
	} else if (calenderError) {
		content = <div>An error occured</div>;
	} else if (calenderData) {
		content = calenderData?.result.length < 1  ? <div className="text-lg capitalize text-center ">no appointment this month ;)</div>: 
		 (
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
				{" "}
				<span className="capitalize text-2xl cursor-pointer  flex items-center">
					walter
					<img
						src={scissors}
						alt="image of scissors"
						className="pt-2 h-14 w-14"
					/>
				</span>
				<div className="flex gap-4 text-lg capitalize">
					<Link to={"/history"}>history</Link>
					<button onClick={handleLogout} className="text-blue-3">
						Log out
					</button>
				</div>
			</nav>
			<div className="px-3 md:px-20 lg:px-12 pb-10 md:pb-0">
				<h1 className="text-xl md:text-2xl mt-4 font-bold">
					Welcome back, {customer?.username}
				</h1>
				<p>{customer?.email}</p>

				<div className="flex flex-col lg:flex-row gap-8 pt-5">
					<div className="">
						<Calender
							setCurrentAppointmentDate={
								setCurrentAppointmentDate
							}
							setAppointmentInfoModal={setAppointmentInfoModal}
							generateCalender={generateCalender}
							data={calenderData}
							isLoading={calenderIsLoading}
						/>
					</div>

					<div className="flex-1">
						<div className="flex flex-col justify-between items-center">
							<h3 className="capitalize text-lg md:text-2xl text-center font-semibold">
								upcoming appointments this month
							</h3>

							<button
								onClick={() => setShowModal(true)}
								className="border-2 flex items-center self-start capitalize mt-2 mb-4 bg-blue-4 text-white-3 p-2 text-base md:text-lg"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="ionicon w-8 h-8 md:w-10 md:h-10 text-[#5f656e]"
									viewBox="0 0 512 512"
								>
									<title>Add</title>
									<path
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="32"
										d="M256 112v288M400 256H112"
									/>
								</svg>
								create new appointment
							</button>
						</div>
						{content}
					</div>
				</div>
			</div>
			{showModal &&
				createPortal(
					<div className="bg-[rgba(0,0,0,.2)] border-2 border-red-300 absolute top-0 left-0 right-0 h-screen w-screen p-4 py-6 z-20 animate-modal">
						<div className="h-[90vh] sm:w-4/6 mx-auto md:max-w-lg">
							<div className="bg-slate-50 relative z-10 h-full overflow-y-scroll p-2">
								<div>
									<h3 className="basis-3/6  capitalize text-xl lg:text-2xl text-center pt-6">
										create appointment
									</h3>
									<button
										onClick={(e) => {
											
											setShowModal(false)
										}}
										className="basis-1/4 p-1 absolute top-0 right-0"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="ionicon w-10 h-10 text-red-400"
											viewBox="0 0 512 512"
										>
											<title>Close</title>
											<path
												fill="none"
												stroke="currentColor"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="32"
												d="M368 368L144 144M368 144L144 368"
											/>
										</svg>
									</button>
								</div>
								<div>
									<AppointmentForm
										currentDate={new Date()
											.toISOString()
											.slice(0, 10)}
											
									/>
								</div>
							</div>
						</div>
					</div>,
					document.body
				)}
			{appointmentInfoModal &&
				createPortal(
					<div className="bg-[rgba(0,0,0,.2)] border-2 absolute top-0 left-0 right-0 h-screen w-screen p-4 py-6 z-40 animate-modal">
						<AppointmentInfo
							currentAppointmentDate={currentAppointmentDate}
							hairStyle={hairStyleData?.hairStyles}
							setAppointmentInfoModal={setAppointmentInfoModal}
						/>
					</div>,
					document.body
				)}
		</div>
	);
};

export default Dashboard;
