import { ChangeEvent, useState, FormEvent, useEffect } from "react";
import { useSignupMutation } from "./authApiSlice";
import { schema } from "../../joiValidations/signUp";
import { Link } from "react-router-dom";
import scissors from "../../assets/scissors.png";
import { useNavigate } from "react-router-dom";

interface InputValue {
	username: string;
	password: string;
	email: string;
}

interface Message {
	type: string;
	value: string;
}

const SignUp = () => {
	const navigate = useNavigate();
	const [inputValue, setInputValue] = useState<InputValue>({
		username: "",
		password: "",
		email: "",
	});
	const [message, setMessage] = useState<Message>({ type: "", value: "" });
	const [signup] = useSignupMutation();

	useEffect(() => {
		const timeOut = setTimeout(() => {
			setMessage({ type: "normal", value: "" });
		}, 3000);

		return () => clearTimeout(timeOut);
	}, [message]);

	function inputHandler(e: ChangeEvent<HTMLInputElement>) {
		setInputValue({
			...inputValue,
			[e.target.id]: e.target.value,
		});
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const { value, error } = schema.validate({ ...inputValue });

		if (error) {
			setMessage({ type: "error", value: error.message });
		} else {
			console.log("sumitedd redirecting");

			try {
				await signup({ ...value }).unwrap();
				setMessage({
					type: "success",
					value: "account created successfully!",
				});
				navigate("/login");
			} catch (error: any) {
				setMessage({ type: "error", value: error?.data?.message });
			}
		}

		setInputValue({
			username: "",
			password: "",
			email: "",
		});
	}
	return (
		<div className="relative font-montserrat bg-blue-4 h-screen text-white-3">
			<div className="text-blue-2 bg-blue-4 h-screen animate-splash-screen absolute top-0 left-0 right-0  flex items-center justify-center px-4">
				<p className="text-3xl animate-slideUpText text-center">
					"A haircut is a new beginning...a new life, really." - Garth
					Stein
				</p>
			</div>
			<nav className="flex justify-between items-center  border-b-2 border-blue-2 h-[10vh] animate-header-2 px-2 md:mx-8 lg:mx-20 ">
				<Link
					to={"/"}
					className="capitalize text-2xl cursor-pointer  flex items-center"
				>
					walter
					<img
						src={scissors}
						alt="image of scissors"
						className="pt-2 h-14 w-14"
					/>
				</Link>

				<ul className="flex gap-4 capitalize font-semibold ">
					<li>
						<Link
							to={"/login"}
							className="p-2 cursor-pointer border-red-300 text-blue-2"
						>
							log in
						</Link>
					</li>
				</ul>
			</nav>

			<div className="px-8 md:max-w-lg mx-auto pt-14 lg:max-w-xl animate-slideUp">
				<h2 className="text-3xl text-center font-semibold mb-6">
					Signup
				</h2>

				<p
					className={` text-base capitalize text-center mb-4 h-10 ${
						message.value &&
						message.type === "error" &&
						"border-2 p-2 border-red-600 text-red-500"
					} ${
						message.value &&
						message.type === "success" &&
						"border-2 p-2 border-green-600 text-green-500"
					} `}
				>
					{message.value}
				</p>
				<form onSubmit={handleSubmit}>
					<div className="border-b border-blue-2 mb-4">
						<label
							className="capitalize  block text-blue-2"
							htmlFor="username"
						>
							Username
						</label>
						<input
							className="border-2 w-full p-2 py-3 text-white-3 appearance-none bg-transparent border-none px-2 leading-tight focus:outline-none"
							id="username"
							value={inputValue.username}
							onChange={inputHandler}
						/>
					</div>
					<div className="border-b border-blue-2 mb-4">
						<label
							className="capitalize  block text-blue-2"
							htmlFor="email"
						>
							email
						</label>
						<input
							className="border-2 w-full p-2 py-3 text-white-3 appearance-none bg-transparent border-none px-2 leading-tight focus:outline-none"
							id="email"
							value={inputValue.email}
							onChange={inputHandler}
						/>
					</div>
					<div className="border-b border-blue-2">
						<label
							className="capitalize  block text-blue-2"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className="border-2 w-full p-2 py-3 text-white-3 appearance-none bg-transparent border-none px-2 leading-tight focus:outline-none"
							id="password"
							value={inputValue.password}
							onChange={inputHandler}
							type={"password"}
						/>
					</div>
					<Link
						to={"/login"}
						className="capitalize block text-center my-2 underline-offset-4 underline"
					>
						Already have an account? Login.
					</Link>
					<button
						className={`bg-blue-500 text-blue-4
						p-2 px-8 text-xl my-4 font-semibold  mx-auto block w-max 
						${message.type === "error" && "animate-shake bg-red-600 text-white"}
						${message.type === "success" && "bg-green-500 text-white"}
                    `}
					>
						Signup
					</button>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
