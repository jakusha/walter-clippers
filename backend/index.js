const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const cookieParser = require("cookie-parser");
const db = require("./config/db");
const customerRouter = require("./router/customer");
const appointmentRouter = require("./router/appointment");
const hairStyleRouter = require("./router/hairstyle");
const authRouter = require("./router/authentication");
const calenderRouter = require("./router/calender");
const Roles = require("./model/Roles");
const corsOptions = require("./config/corsOption");
const { verifyJwt } = require("./middlewares/verifyJwt");

app.use(
	cors({
		origin: ["http://localhost:3000", "https://cutzy-razors.vercel.app/"],
		credentials: true,
	})
);
// app.use(cors(corsOptions));
//plarse cookies
app.use(cookieParser());

//built in expressjs json parser middleware
app.use(express.json());

// logger middleware
app.use(morgan("dev"));

//buitin middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.json({ message: "hello world" });
});

app.use("/customer", verifyJwt, customerRouter);
app.use("/appointment", verifyJwt, appointmentRouter);
app.use("/hairstyle", verifyJwt, hairStyleRouter);
app.use("/auth", authRouter);
app.use("/calender", verifyJwt, calenderRouter);

const port = process.env.PORT;

//connect to database and start server
const startDb = async () => {
	try {
		await db.authenticate();
		await db.sync();
		console.log("Connection has been established successfully.");
		app.listen(port, () => {
			console.log(`app listening at PORT ${port}`);
		});
		await Roles.findOrCreate({
			where: {
				role: "Admin",
			},
			defaults: {
				role: "Admin",
				roleId: 3232,
			},
		});
		await Roles.findOrCreate({
			where: {
				role: "Customer",
			},
			defaults: {
				role: "Customer",
				roleId: 4848,
			},
		});
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};

startDb();
