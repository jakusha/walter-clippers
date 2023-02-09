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
const Roles = require("./model/Roles");

app.use(cors());
// logger middleware
app.use(morgan("dev"));

app.use(cookieParser());

//built in expressjs json parser middleware
app.use(express.json());

//buitin middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.json({ message: "hello world" });
});

app.use("/customer", customerRouter);
app.use("/appointment", appointmentRouter);
app.use("/hairstyle", hairStyleRouter);
app.use("/auth", authRouter);

const PORT = 3000;

//connect to database and start server
const startDb = async () => {
	try {
		await db.authenticate();
		await db.sync();
		console.log("Connection has been established successfully.");
		app.listen(PORT, () => {
			console.log(`app listening at port ${PORT}`);
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
