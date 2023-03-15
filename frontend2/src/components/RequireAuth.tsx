import {  ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, redirect } from "react-router";
import { selectAuthToken } from "../features/auth/authSlice";

import jwt_decode, {JwtPayload} from "jwt-decode";


interface Auth{
	exp: number;
	iat: number;
	roles:number[];
	username: string;
}

const RequireAuth = ({ children, allowedRoles }: {children: ReactNode, allowedRoles?: number[]}) => {
	const token = useSelector(selectAuthToken);
	let decodedToken:Auth | null;
	let content = children;

	if(token) {
		decodedToken = jwt_decode<JwtPayload>(token) as Auth
			
			if(token && decodedToken.roles && allowedRoles){
			const isAllowed = decodedToken.roles.find(role => allowedRoles?.includes(role));
			console.log(isAllowed,isAllowed === undefined, decodedToken.roles, "Allowed")
			if (isAllowed === undefined ) {
				console.log();
				
				content = <Navigate to="/dashboard"  replace />
				
			}
		}
		  
	
	}

	useEffect(()=> {
		if(!token) {
			redirect("/login")
		}
	}, [token])
	

	
	return <>{content} </>
};

export default RequireAuth;
