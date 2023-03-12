import { ChangeEvent, useState, FormEvent } from "react";


interface InputValue {
    username: string;
    password: string;
    email: string
}
const Signup = () => {
	const [inputValue, setInputValue] = useState<InputValue>({
		username: "",
		password: "",
		email: "",
	});

	function inputHandler(e: ChangeEvent<HTMLInputElement>) {
		// console.log(e.target.value);
		// console.log(e.target.id);
		setInputValue({
			...inputValue,
			[e.target.id]: e.target.value,
		});
	}

	function handleSubmit(e:FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log(inputValue);
		setInputValue({
			username: "",
			password: "",
			email: "",
		});
	}
	return (
		<div>
			<div className="w-5/12 mx-auto pt-12">
				<h2 className="text-3xl text-center font-semibold mb-10">
					Signup
				</h2>
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
							value={inputValue.username}
							onChange={inputHandler}
						/>
					</div>
					<div>
						<label
							className="capitalize my-2 block"
							htmlFor="email"
						>
							email
						</label>
						<input
							className="border-2 w-full p-2 rounded-md"
							id="email"
							value={inputValue.email}
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
							value={inputValue.password}
							onChange={inputHandler}
							type={"password"}
						/>
					</div>

					<button
						className="border-2 bg-blue-500 text-white
                    p-2 px-4 rounded-md text-xl my-4 mx-auto block w-max
                    "
					>
						Signup
					</button>
				</form>
			</div>
		</div>
	);
};

export default Signup;
