import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
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
		<div>
			<div className="w-5/12 mx-auto pt-12">
				<h2 className="text-3xl text-center font-semibold mb-10">
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
							className="border-2 w-full p-2 rounded-md"
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
							className="border-2 w-full p-2 rounded-md"
							id="password"
							autoComplete={"current-password"}
							value={inputValue.password}
							onChange={inputHandler}
							type={"password"}
						/>
					</div>

					<p className="underline my-2">
						forgot username or password?
					</p>

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
