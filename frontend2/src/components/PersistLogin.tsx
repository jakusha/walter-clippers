import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRefreshTokenMutation } from "../features/auth/authApiSlice";
import { selectAuthToken } from "../features/auth/authSlice";
import { setCredentials } from "../features/auth/authSlice";
import { Link, Navigate } from "react-router-dom";

const PersistLogin = ({ children }: {children : ReactNode}) => {
	const token = useSelector(selectAuthToken);
	const dispatch = useDispatch();
	const [refreshStatus, setRefreshStatus] = useState<boolean>(false);
	const [errMsg, setErrMsg] = useState<boolean>(false);
	const [refreshToken, { isLoading, isSuccess }] =
		useRefreshTokenMutation();
	

	useEffect(() => {
		async function refresh() {
			try {
				const result = await refreshToken("asd").unwrap();
				console.log(result, "RESSuLLLL!!!!");
				dispatch(setCredentials({ ...result }));
				setRefreshStatus(true);
			} catch (error) {
				console.log(error);
				setErrMsg(true);
			}
		}
		console.log(token, "TOKENNNNN!!!!!");
		if (!token) {
			refresh();
		}
	}, [refreshToken, token, dispatch]);

	let content;

	if (isLoading) {
		content = <div>Loading ....</div>;
	}

	if (isSuccess && refreshStatus) {
		content = children;
	}

	if (token) {
		content = children;
	}
    
	if (errMsg) {
		content = (
			<div>
				An error occured <Link to="/login">please login again</Link>
				<Navigate to={"/login"} replace />
			</div>
		);
	}
	return (
		<div>
			{content}
			
		</div>
	);
};

export default PersistLogin;
