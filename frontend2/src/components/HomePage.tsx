import { Link } from "react-router-dom";

const HomePage = () => {
	return (
		<div>
			<nav className="flex justify-between">
				<span className="capitalize text-xl">sir shave</span>

				<ul className="flex gap-4">
					<li className="capitalize font-semibold border-2 border-blue-500 p-2 rounded-md hover:text-white hover:bg-blue-500 cursor-pointer">
						<Link to={"/login"}>log in</Link>
					</li>
					<li className="capitalize font-semibold border-2 border-blue-500 p-2 rounded-md hover:text-white hover:bg-blue-500 cursor-pointer">
						<Link to={"/signup"}>sign up</Link>
					</li>
				</ul>
			</nav>
			<h2 className="text-7xl font-bold capitalize w-max mx-auto pt-32">
				<span className="block">Sir</span>
				<span className="block ml-14">shave</span>
			</h2>
		</div>
	);
};

export default HomePage;
