import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useLoginMutation } from "./authApiSlice";
import { setCredentials } from "./authSlice";
import scissors from "../../assets/scissors.png"
import {schema} from "../../joiValidations/login"

const Login = () => {
	const [inputValue, setInputValue] = useState({
		username: "",
		password: "",
	});
	const [error, setError] = useState("");
	
	const dispatch = useDispatch();
	const [login, status] = useLoginMutation();

	// console.log(status, status?.isLoading , "is loading state")
	const navigate = useNavigate();
	function inputHandler(e:ChangeEvent<HTMLInputElement>) {
		setInputValue({
			...inputValue,
			[e.target.id]: e.target.value,
		});
	}

	async function handleSubmit(e:FormEvent<HTMLFormElement>) {
		e.preventDefault();
	
		// console.log(inputValue)
		const {value, error} = schema.validate({...inputValue})

		if(error) {
			setError(error.message)
			return;
		}

		try {
			const result = await login({ ...value }).unwrap();
			// console.log(result, "REsult from auth")
			dispatch(setCredentials({ ...result }));
			navigate("/dashboard");
		} catch (error: any) {	
			
            if(error?.data === "Conflict") {
                setError("Invalid Username Or Password");
            }else {
				if(error?.data?.message) {
					setError(error?.data?.message);
				}else {

					setError("an error occured");
				}
            }
		}

		setInputValue({
			username: "",
			password: "",
		});
	}

	useEffect(() => {
		const timeout = setTimeout(() => {
			setError("");
		}, 4000);

		return () => clearTimeout(timeout);
	}, [error]);

	let buttonEl;
	
		
	if (status?.isLoading) {
		buttonEl = <button className={`bg-teal-300 text-blue-4
		p-2 px-8 text-xl my-4 font-semibold  mx-auto block w-max  flex gap-2`}>
			<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
			loading...</button>
	}else{
		buttonEl = <button className={`bg-blue-500 text-blue-4
		p-2 px-8 text-xl my-4 font-semibold  mx-auto block w-max ${error ? "animate-shake bg-red-600 text-white": "bg-teal-300"}`}>login</button>
	}
	return (
		<div className="relative font-montserrat bg-blue-4 h-screen text-white-3">
			<div className="text-blue-2 bg-blue-4 h-screen animate-splash-screen absolute top-0 left-0 right-0  flex items-center justify-center px-4 ">
				<p className="text-3xl animate-slideUpText text-center">"When in doubt, get a haircut." - Unknown</p>
			</div>
			<nav className="flex justify-between items-center border-b-2 border-blue-2 h-[10vh] animate-header-2 px-2 md:mx-8 lg:mx-20 ">
				<Link to={"/"} className="capitalize text-2xl cursor-pointer  flex items-center">walter
				<img src={scissors} alt="image of scissors" className="pt-2 h-14 w-14"/></Link>

				<ul className="flex gap-4 capitalize font-semibold ">
					
				<li>
				<Link to={"/signup"} className="p-2 cursor-pointer border-red-300 text-blue-2">sign up</Link>
					</li>
				</ul>
			</nav>
			<div className="px-8 md:max-w-lg mx-auto pt-20 lg:max-w-xl animate-slideUp">
				<h2 className="text-3xl lg:text-4xl text-center font-semibold mb-6 lg:mb-10">
					Login
				</h2>
				<p className={` border-red-600 text-red-500 h-10 text-base capitalize text-center ${error && ' border-2 p-2'} `}>{error}</p>
				<form onSubmit={handleSubmit}>
					<div className="border-b border-blue-2 mb-4">
						<label
							className="capitalize  block text-blue-2 lg:text-xl"
							htmlFor="username"
						>
							Username
						</label>
						<input
							className="border-2 w-full p-2 py-3 md:py-4  text-white-3 appearance-none bg-transparent border-none px-2 leading-tight focus:outline-none"
							id="username"
							autoComplete={"username"}
							value={inputValue.username}
							onChange={inputHandler}
						/>
					</div>

					<div className="border-b border-blue-2">
						<label
							className="capitalize  block text-blue-2 lg:text-xl"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className="border-2 w-full p-2 py-3 text-white-3 appearance-none bg-transparent border-none px-2 leading-tight focus:outline-none"
							id="password"
							autoComplete={"current-password"}
							value={inputValue.password}
							onChange={inputHandler}
							type={"password"}
						/>
					</div>

					<Link to={"/signup"} className="capitalize block text-center mt-6 underline-offset-4 underline">
						Don't have an account? Sign up.
					</Link>
					{buttonEl}
				</form>
			</div>
		</div>
	);
};

export default Login;
