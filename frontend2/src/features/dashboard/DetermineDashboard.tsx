import React from 'react'
import { useAppSelector } from '../../hooks/hooks'
import { selectAuthToken } from '../auth/authSlice'
import jwt_decode, {JwtPayload} from "jwt-decode";
import AdminDashboard from './AdminDashboard';
import Dashboard from './Dashboard';

interface Auth{
	exp: number;
	iat: number;
	roles:number[];
	username: string;
}

const DetermineDashboard = () => {
    const token = useAppSelector(selectAuthToken)

    let decodedToken:Auth | null;
	let content;

	if(token) {
		decodedToken = jwt_decode<JwtPayload>(token) as Auth
		// console.log(decodedToken?.roles,decodedToken?.roles?.includes(4848), "decoded")
		if(decodedToken?.roles?.includes(4848)) {
			content = <Dashboard />
		}else {
			content = <AdminDashboard />
		}
	}

  return (
    <>{content}</>
  )
}

export default DetermineDashboard