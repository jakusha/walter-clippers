import { useState, useEffect } from "react";
import ShowMore from "../../components/ShowMore";
import {
	HairStyle,
	useGetAllHairStylesQuery,
	useGetCustomerAppointmentsQuery,
} from "../appointments/appointmentApiSlice";
import { selectAuthCustomer } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import scissors from "../../assets/scissors.png"

interface  currentAppointmentDate {
		date: string;
		time: string;
		appointmentId: string;
		hairStyleId: string;
		completed: boolean
}

const History = () => {
	const customer = useSelector(selectAuthCustomer);
	const { data, isLoading } = useGetCustomerAppointmentsQuery(
		customer?.custId
	);
	const [currentAppointmentDate, setCurrentAppointmentDate] = useState<currentAppointmentDate>({} as currentAppointmentDate );
	const [appointmentInfoModal, setAppointmentInfoModal] = useState(false);
	const {data:hairStyleData, isSuccess: hairStyleDataSucces} = useGetAllHairStylesQuery();

	let price;
	let style;
	if(hairStyleDataSucces) {
		 price = hairStyleData?.hairStyles?.find(
			(style:HairStyle) => style?.hairStyleId === currentAppointmentDate?.hairStyleId
		)?.price;
		style = hairStyleData?.hairStyles?.find(
			(style:HairStyle) => style.hairStyleId === currentAppointmentDate?.hairStyleId
		)?.name;
	}

	useEffect(() => {
		if (appointmentInfoModal  ) {
			document.body.style.position = "fixed";
			document.body.style.top = `-${window.scrollY}px`;
			document.body.style.left = "0px"
			document.body.style.right = "0px"
		}

		return () => {
			const scrollY = document.body.style.top;
			document.body.style.position = "";
			document.body.style.top = "";
			window.scrollTo(0, parseInt(scrollY || "0") * -1);
		};
	}, [appointmentInfoModal]);
	




	let content;
	if (isLoading) {
		content = <div>loading.....</div>;
	} else if (data) {
		const transformedData = data.map((item:any) => (
			<div key={uuidv4()} className="py-4 p-2 flex items-center gap-4 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]  capitalize h-16 ">
				<span>{item.date}</span>
				<span>{
					hairStyleData?.hairStyles?.find(
						(style:HairStyle) => style?.hairStyleId === item?.hairStyleId
					)?.name
				}</span>
				<span
					onClick={() => {
						setCurrentAppointmentDate(item);
						setAppointmentInfoModal(true);
					}}
					className='text-blue-1 cursor-pointer ml-auto'
				>
					details
				</span>
			</div>
		));
		if(transformedData.length < 1) {
		content = <div className="text-center text-xl font-semibolds">You currently dont have any appointment history ;) </div>
		}else {

			content = <ShowMore data={transformedData} />;
		}
	}

	return (
		<div>
		<nav className="flex justify-between  border-b-2 border-blue-4 items-center px-2 md:px-14 overflow-hidden  w-full">
				{" "}
				<Link to={"/dashboard"}>
				<span className="capitalize text-2xl cursor-pointer  flex items-center">
					walter
					<img
						src={scissors}
						alt="image of scissors"
						className="pt-2 h-14 w-14"
					/>
				</span>
				</Link>
				<div className="flex gap-4 text-lg capitalize text-blue-3">
					<Link to={"/dashboard"}>dashboard</Link>
					
				</div>
			</nav>
			<h2 className=" text-center capitalize text-xl md:text-2xl lg:text-3xl font-semibold pt-10 mb-5">Appointment History</h2>
			<div className="w-3/4 max-w-lg mx-auto">
				{content}
			</div>
			{appointmentInfoModal &&
				createPortal(
					<div className="bg-[rgba(0,0,0,.2)] border-2 absolute top-0 left-0 right-0 h-screen w-screen p-4 py-6 z-40 animate-modal">
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
						<span className="">{currentAppointmentDate?.date}</span>
								</div>
								<div className="flex">
						<span className="text-lg  w-20">time:</span>
									<span>{currentAppointmentDate?.time?.slice(0, 5)}</span>
								</div>
							</div>
						</div>
					</div>,
					document.body
				)}
		</div>
	);
};

export default History;
