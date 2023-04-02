import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./features/auth/Login";
import NoMatch from "./components/NoMatch";
import Dashboard from "./features/dashboard/Dashboard";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import History from "./features/dashboard/History";
import DetermineDashboard from "./features/dashboard/DetermineDashboard";
import HairStyle from "./features/dashboard/HairStyle";
import SignUp from "./features/auth/SignUp";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<HomePage />} />
				<Route path="/login" element={<Login />} />
				
				<Route path="/signup" element={<SignUp />} />
				<Route
					path="/dashboard"
					element={
						<PersistLogin>
							<RequireAuth>
								<DetermineDashboard />
							</RequireAuth>
						</PersistLogin>
					}
				/>
				<Route
					path="/history"
					element={
						<PersistLogin>
							<RequireAuth>
								<History />
							</RequireAuth>
						</PersistLogin>
					}
				/>
				<Route
					path="/hairstyle"
					element={
						<PersistLogin>
							<RequireAuth allowedRoles={[3232]}>
								<HairStyle />
							</RequireAuth>
						</PersistLogin>
					}
				/>
				
				<Route path="*" element={<NoMatch />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
