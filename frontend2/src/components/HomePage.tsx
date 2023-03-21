import { Link } from "react-router-dom";

const HomePage = () => {
	return (
		<div className="">
			<nav className="flex justify-between items-center  border-b-2 h-[10vh] animate-header-2 px-2 md:mx-8 lg:mx-20">
				<span className="capitalize text-xl">walter</span>

				<ul className="flex gap-4 capitalize font-semibold ">
					<li>
						<Link to={"/signup"} className="border-2 p-2 cursor-pointer border-red-300">sign up</Link>
					</li>
					<li>
						<Link to={"/login"} className="border-2 p-2 cursor-pointer border-red-300">log in</Link>
					</li>
				</ul>
			</nav>
			<div className="text-center capitalize h-[90vh] flex  flex-col items-center justify-center overflow-hidden">
				<div className="animate-header-intro -mt-36 font-nunito">
					<h1 className="text-6xl lg:text-8xl font-bold animate-header-1 font">
						walters clippers
					</h1>
					<h2 className="text-lg md:text-xl animate-header-2 my-2">fine and distinguished grooming by walter</h2>
				</div>

				<Link to={"/login"} className="text-xl font-semibold capitalize bg-teal-300 p-4  animate-slideUpButton"> book an appointment</Link>
			</div>
		</div>
	);
};

export default HomePage;
