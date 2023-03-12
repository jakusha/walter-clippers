import React, { ReactElement, ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, redirect, useNavigate } from "react-router";
import { selectAuthToken } from "../features/auth/authSlice";

const RequireAuth = ({ children }: {children: ReactNode}) => {
	const token = useSelector(selectAuthToken);
	
	useEffect(()=> {
		if(!token) {
			redirect("/login")
		}
	}, [token])
	console.log(token, "HAHAHAHA TOOKKEKEKEMNNNN");

	return <>{children} </>
};

export default RequireAuth;
