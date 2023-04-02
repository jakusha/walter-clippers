import { Link } from "react-router-dom";
import scissors from "../assets/scissors.png"

const HomePage = () => {
	return (
		<div className="bg-blue-4 text-white-3 font-montserrat">
			<nav className="flex justify-between items-center  border-b-2 border-blue-2 h-[10vh] animate-header-2 px-2 md:mx-8 md:pt-10 md:pb-6 lg:mx-20 ">
				<span className="capitalize text-2xl flex items-center">walter
				<img src={scissors} alt="image of scissors" className="pt-2 h-14 w-14"/>
				</span>

				<ul className="flex gap-2 md:gap-4 capitalize font-semibold text-base">
					<li>
						<Link to={"/signup"} className="p-2 cursor-pointer border-red-300">sign up</Link>
					</li>
					<li>
						<Link to={"/login"} className=" p-2 cursor-pointer border-red-300 text-blue-2">log in</Link>
					</li>
				</ul>
			</nav>
			<div className="text-center capitalize h-[90vh] flex  flex-col items-center justify-center overflow-hidden text-white-3 pt-12">
				<div className="animate-header-intro -mt-36">
					<h1 className="text-4xl md:text-6xl lg:text-8xl font-bold animate-header pb-3">
						walter clippers
					</h1>
					<h2 className="text-base md:text-xl animate-header-2 my-2 mb-6">fine and distinguished grooming by walter</h2>
				</div>
				
				<Link to={"/login"} className="text-xl font-semibold capitalize bg-blue-2 text-blue-4 p-4  animate-slideUpButton"> book an appointment</Link>
			</div>
		</div>
	);
};

export default HomePage;
