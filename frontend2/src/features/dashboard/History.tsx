import React, { useEffect, useState } from "react";
import ShowMore from "../../components/ShowMore";
import {
	HairStyle,
	useGetAllHairStylesMutation,
	useGetCustomerAppointmentsQuery,
} from "../appointments/appointmentApiSlice";
import { selectAuthCustomer } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";


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
	const [getAllHairStyles] = useGetAllHairStylesMutation();
	const [hairStyles, setHairStyles] = useState<HairStyle[]>([]);

	
	const price = hairStyles?.find(
		(style:HairStyle) => style?.hairStyleId === currentAppointmentDate?.hairStyleId
	)?.price;
	const style = hairStyles?.find(
		(style:HairStyle) => style.hairStyleId === currentAppointmentDate?.hairStyleId
	)?.name;


	useEffect(() => {
		async function fetchHairStyle() {
			try {
				const result = await getAllHairStyles('asd').unwrap();
				setHairStyles(result.hairStyles);
			} catch (error) {
				console.log("aN ERROR OCCURED IN FETCHIG Hairstyle");
			}
		}
		fetchHairStyle();
	}, [getAllHairStyles]);

	let content;
	if (isLoading) {
		content = <div>loading.....</div>;
	} else if (data) {
		const transformedData = data.map((item:any) => (
			<div key={uuidv4()}>
				{item.date}
				{
					hairStyles?.find(
						(style:HairStyle) => style?.hairStyleId === item?.hairStyleId
					)?.name
				}
				<span
					onClick={() => {
						setCurrentAppointmentDate(item);
						setAppointmentInfoModal(true);
					}}
				>
					details
				</span>
			</div>
		));
		content = <ShowMore data={transformedData} />;
	}

	return (
		<div>
			<div>
				{" "}
				<Link to={"/dashboard"}>Dashboard</Link>
			</div>
			<h2 className=" text-center capitalize">Appointment History</h2>
			{content}
			{appointmentInfoModal &&
				createPortal(
					<div className="bg-transparent border-2 border-red-300 absolute top-0 left-0 right-0 h-screen w-screen py-10">
						<div className="bg-white">
							<div className="flex justify-between">
								<div className="basis-1/4"></div>
								<h3 className="basis-3/6 border-2 text-center capitalize">
									appointment info
								</h3>
								<button
									onClick={() =>
										setAppointmentInfoModal(false)
									}
									className="basis-1/4"
								>
									close modal
								</button>
							</div>
							<div>
								<div>
									<span>style: </span><span>{style}</span>
								</div>
								<div>
								<span>price: </span><span>{price}</span></div>
								<div>
									date:
									{currentAppointmentDate?.date}
								</div>
								<div>
									time:{" "}
									{currentAppointmentDate?.time?.slice(0, 5)}
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
