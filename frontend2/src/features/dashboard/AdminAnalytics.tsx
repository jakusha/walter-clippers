import React from 'react'
import { Link } from 'react-router-dom'
import scissors from "../../assets/scissors.png";
import { ResponsiveContainer, BarChart , Bar, XAxis, YAxis , Tooltip, CartesianGrid, Legend} from 'recharts';
import { useAnalyticsQuery } from '../appointments/appointmentApiSlice';


const AdminAnalytics = () => {
    const {data, isLoading} = useAnalyticsQuery("asd")

    let content;
    if(isLoading) {
        content =<div className='text-2xl font-semibold text-center capitalize my-10'>loading analytics....</div>
    }else {
        content = <>
        
        <div className='md:w-[80%] lg:max-w-3xl  mx-auto px-2'>
            <h2 className='text-2xl text-center font-semibold'>Finances</h2>
        <ResponsiveContainer width={"100%"} height={400}>
            <BarChart data={data.finalFinance}>
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
        </div>

        <div className='md:w-[80%] lg:max-w-3xl  mx-auto px-2 my-10'>
            <h2 className='text-2xl text-center font-semibold'>Customers</h2>
        <ResponsiveContainer width={"100%"} height={400}>
            <BarChart data={data.finalCustomer}>
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="noOfCustomers" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
        </div>
        </>
    }
  return (
    <div>
        <nav className="flex justify-between border-b-2 border-blue-4 items-center px-2 md:px-14 overflow-hidden  w-full">
				{" "}
                <Link to={"/dashboard"}>
				<span className="capitalize text-2xl cursor-pointer  flex items-center">
					walter
					<img
						src={scissors}
						alt="image of scissors"
						className="pt-2 h-14 w-14"
					/>
				</span>
                </Link>
				<div className="flex gap-4 text-lg capitalize">
					<Link to={"/dashboard"}>dashboard</Link>
				</div>
			</nav>
        <h2 className='text-3xl text-center my-6'>Analytics</h2>
        {content}
    </div>
  )
}

export default AdminAnalytics