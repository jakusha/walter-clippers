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
const { verifyRoles } = require("./middlewares/verifyRoles");

//plarse cookies
app.use(cookieParser());

//built in expressjs json parser middleware
app.use(express.json());

app.use(cors(corsOptions));

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

// const PORT = 3333;

//connect to database and start server
const startDb = async () => {
	try {
		await db.authenticate();
		await db.sync();
		console.log("Connection has been established successfully.");
		// app.listen(, () => {
		// 	console.log(`app listening`);
		// });
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
