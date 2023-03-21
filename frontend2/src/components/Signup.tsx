import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
	const [inputValue, setInputValue] = useState({
		username: "",
		password: "",
		email: "",
	});

	function inputHandler(e:ChangeEvent<HTMLInputElement>) {
		
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
		<div className="relative">
			<div className="bg-orange-500 h-screen animate-splash-screen absolute top-0 left-0 right-0  flex items-center justify-center px-4">
				<p className="text-4xl lg:text-5xl font-istok text-white animate-slideUpText text-center max-w-xl">"A haircut is a new beginning...a new life, really." - Garth Stein</p>
			</div>
			<nav className="flex justify-between items-center  border-b-2 h-[10vh] animate-header-2 md:mx-8 lg:mx-20">
				<Link to={"/"} className="capitalize text-xl cursor-pointer">walter</Link>

				<ul className="flex gap-4 capitalize font-semibold ">
					
					<li>
						<Link to={"/login"} className="border-2 p-2 cursor-pointer border-red-300">log in</Link>
					</li>
				</ul>
			</nav>
			
			<div className="px-8 md:max-w-lg mx-auto pt-12 lg:max-w-xl animate-slideUp">
			<h2 className="text-3xl text-center font-semibold mb-6">
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
							className="border-2 w-full p-2 py-3"
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
							className="border-2 w-full p-2 py-3"
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
							className="border-2 w-full p-2 py-3"
							id="password"
							value={inputValue.password}
							onChange={inputHandler}
							type={"password"}
						/>
					</div>
					<Link to={"/login"} className="capitalize block text-center mt-2 underline-offset-4 underline">Already have an account? Login.</Link>
					<button
						className="border-2 bg-blue-500 text-white
                    p-2 px-4 text-xl my-4 mx-auto block w-max
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
