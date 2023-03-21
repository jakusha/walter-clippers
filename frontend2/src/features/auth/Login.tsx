import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useLoginMutation } from "./authApiSlice";
import { setCredentials } from "./authSlice";


const Login = () => {
	const [inputValue, setInputValue] = useState({
		username: "",
		password: "",
	});
	const [error, setError] = useState<string |undefined>(undefined);
	const dispatch = useDispatch();
	const [login] = useLoginMutation();
	const navigate = useNavigate();
	function inputHandler(e:ChangeEvent<HTMLInputElement>) {
		setInputValue({
			...inputValue,
			[e.target.id]: e.target.value,
		});
	}

	async function handleSubmit(e:FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log(inputValue);

		try {
			const result = await login({ ...inputValue }).unwrap();
			
			dispatch(setCredentials({ ...result }));
			navigate("/dashboard");
			console.log(result, "RESULTTSSSS!!!!!!11");
		} catch (error: any) {
			console.log("An error Occured!!!!", error);
			
            if(error?.data) {
                setError(error.data.message);
            }else {
                setError("an error occured");
            }
		}

		setInputValue({
			username: "",
			password: "",
		});
	}

	useEffect(() => {
		const timeout = setTimeout(() => {
			setError(undefined);
		}, 5000);

		return () => clearTimeout(timeout);
	}, [error]);
	return (
		<div className="relative">
			<div className="bg-orange-500 h-screen animate-splash-screen absolute top-0 left-0 right-0  flex items-center justify-center px-4 ">
				<p className="text-3xl text-white animate-slideUpText text-center">"When in doubt, get a haircut." - Unknown</p>
			</div>
			<nav className="flex justify-between items-center  border-b-2 h-[10vh] animate-header-2 md:mx-8 lg:mx-20">
				<Link to={"/"} className="capitalize text-xl cursor-pointer">walter</Link>

				<ul className="flex gap-4 capitalize font-semibold ">
					
				<li>
						<Link to={"/signup"} className="border-2 p-2 cursor-pointer border-red-300">sign up</Link>
					</li>
				</ul>
			</nav>
			<div className="px-8 md:max-w-lg mx-auto pt-12 lg:max-w-xl animate-slideUp">
				<h2 className="text-3xl text-center font-semibold mb-6">
					Login
				</h2>
				<p className="text-red-500">
                    {error !== undefined ?error: ""}
				</p>
				<form onSubmit={handleSubmit}>
					<div>
						<label
							className="capitalize my-2 block"
							htmlFor="username"
						>
							Username
						</label>
						<input
							className="border-2 w-full p-2 py-3 bg-white"
							id="username"
							autoComplete={"username"}
							value={inputValue.username}
							onChange={inputHandler}
						/>
					</div>

					<div>
						<label
							className="capitalize my-2 block"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className="border-2 w-full p-2 py-3 bg-white"
							id="password"
							autoComplete={"current-password"}
							value={inputValue.password}
							onChange={inputHandler}
							type={"password"}
						/>
					</div>

					<Link to={"/signup"} className="capitalize block text-center mt-2 underline-offset-4 underline">
						Don't have an account? Sign up.
					</Link>
					<button
						className="border-2 bg-blue-500 text-white
                    p-2 px-4 rounded-md text-xl my-4 mx-auto block w-max
                    "
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
