const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const cookieParser = require("cookie-parser");
const db = require("./config/db");
const customerRouter = require("./router/customer");
const appointmentRouter = require("./router/appointment");
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
const PORT = 3000;

// db.sync()
// 	.then(() => {
// 		console.log("Connected to postgres database sucessfully");

// 		console.log("Synced db.");
// 	})
// 	.catch((err) => {
// 		console.log("Failed to sync db: " + err.message);
// 	});
const startDb = async () => {
	try {
		await db.authenticate();
		await db.sync();
		console.log("Connection has been established successfully.");
		app.listen(PORT, () => {
			console.log(`app listening at port ${PORT}`);
		});
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};

startDb();
