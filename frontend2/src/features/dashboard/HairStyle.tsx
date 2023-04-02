import {
	ChangeEvent,
	FormEvent,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
	selectHairStyle,
	setHairStyles,
} from "../appointments/appointmentSlice";
import { v4 as uuidv4 } from "uuid";
import {
	useCreateNewHairStyleMutation,
	useGetAllHairStylesQuery,
	useUpdateHairStyleMutation,
} from "../appointments/appointmentApiSlice";
import scissors from "../../assets/scissors.png";
import { Link } from "react-router-dom";
export interface HairStyle {
	name: string;
	price: string;
	hairStyleId?: string;
	createdAt?: string;
	updatedAt?: string;
}

const HairStyle = () => {
	const [newHairStyleModal, setNewHairStyleModal] = useState(false);
	const [hairStyleValue, setHairStyleValue] = useState<HairStyle>({
		name: "",
		price: "",
		hairStyleId: "",
	});
	const dispatch = useAppDispatch();
	const [createNewHairStyle] = useCreateNewHairStyleMutation();
	const { data: hairStyleData } = useGetAllHairStylesQuery();
	const [updateHairStyle] = useUpdateHairStyleMutation();
	const [updating, setUpdating] = useState(false);
	const [errorMsg, setErroMsg] = useState("");

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setHairStyleValue({
			...hairStyleValue,
			[e.target.id]: e.target.value,
		});
	}

    useEffect(() => {
		if (newHairStyleModal) {
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
	}, [ newHairStyleModal]);

    useEffect(()=> {
        const timeout = setTimeout(() => {
            setErroMsg("")
        }, 4000);

        return ()=> clearTimeout(timeout)
    }, [])

	async function submitHandler(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (updating) {
			try {
				console.log(hairStyleValue, "hairstyle values");

				const result: any = await updateHairStyle({
					hairStyleId: hairStyleValue.hairStyleId as string,
					body: {
						name: hairStyleValue.name,
						price: hairStyleValue.price,
					},
				});
				console.log(result, "Updated successfully");

				if (result.error) {
					setErroMsg(result.error.data.message);
				} else {
					setNewHairStyleModal(false);
				}
			} catch (error) {
				console.log(error);
				setErroMsg("an error occured");
			}
		} else {
			try {
				const result: any = await createNewHairStyle({
					body: {
						name: hairStyleValue.name,
						price: hairStyleValue.price,
					},
				});
				if (result.error) {
					setErroMsg(result.error.data.message);
				} else {
					setNewHairStyleModal(false);
				}
			} catch (error) {
				setErroMsg("an error occured");
			}
		}
		console.log(hairStyleValue, "SUBmiteed value");
	}

	let content;
	if (hairStyleData) {
		content = hairStyleData?.hairStyles?.map(
			(hairstyle: {
				name: string;
				price: string;
				hairStyleId: string;
			}) => (
				<div
					key={uuidv4()}
					className="py-4 p-2 flex justify-between shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]  capitalize h-16 "
				>
					{hairstyle.name} {hairstyle.price}{" "}
					<span
						onClick={() => {
							setNewHairStyleModal(true);
							setUpdating(true);
							setHairStyleValue({
								...hairstyle,
							});
						}}
						className="text-blue-1 cursor-pointer"
					>
						update
					</span>
				</div>
			)
		);
	} else {
		content = <div>loading hairstyles</div>;
	}
	return (
		<div className="relative max-w-screen-2xl mx-auto">
			<nav className="flex justify-between border-b-2 border-blue-4 items-center px-2 md:px-14 overflow-hidden  w-full">
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
					<Link to={"/dashboard"}>dashboard</Link>
				</div>
			</nav>
			<h2 className="text-2xl text-center my-4">HairStyle</h2>

			<div className="w-3/4 max-w-lg mx-auto">
				<button
					onClick={() => setNewHairStyleModal(true)}
					className="border-2 flex items-center self-start capitalize mt-2 mb-4 bg-blue-4 text-white-3 p-2 text-base ml-auto"
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
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="32"
							d="M256 112v288M400 256H112"
						/>
					</svg>
					add new hairstyle
				</button>
				{content}
			</div>
			{newHairStyleModal &&
				createPortal(
					<div className="bg-[rgba(0,0,0,.2)] border-2 border-red-300 absolute top-0 left-0 right-0 h-screen w-screen p-4 py-6 z-20">
						<div className="h-[50vh] sm:w-4/6 mx-auto md:max-w-lg  bg-slate-50  relative p-4">
							<div>
								<h3 className="basis-3/6  capitalize text-xl lg:text-2xl text-center pt-6">
									{updating ? "update hairstyle" : "add new hairstyle"}
								</h3>
								<button
									onClick={() => setNewHairStyleModal(false)}
									className="cursor-pointer"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="ionicon w-10 h-10 text-red-400 absolute top-0 right-0 "
										viewBox="0 0 512 512 "
									>
										<title>Close</title>
										<path
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="32"
											d="M368 368L144 144M368 144L144 368"
										/>
									</svg>
								</button>
							</div>
							<form onSubmit={submitHandler}>
								<div className="text-red-500 text-base capitalize text-center ">{errorMsg}</div>
								<div className="flex">
									<label
										htmlFor="name"
										className="text-lg capitalize w-20"
									>
										Name:{" "}
									</label>
									<input
										value={hairStyleValue.name}
										onChange={handleChange}
										id="name"
										required
										className="w-full capitalize py-1"
									/>
								</div>
								<div className="flex">
									<label htmlFor="price" 
                                    className="text-lg capitalize w-20"
                                    >Price: </label>
									<input
										value={hairStyleValue.price}
										onChange={handleChange}
										id="price"
										required
										className="w-full capitalize py-1"
									/>
								</div>
								<button className="bg-blue-4 text-white-2  flex items-center justify-center p-2 px-4 my-4 cursor-pointer mx-auto">
									{updating ? "update" : "confirm"}
								</button>
							</form>
						</div>
					</div>,
					document.body
				)}
		</div>
	);
};

export default HairStyle;
