const HairStyle = require("../model/HairStyle");
const haiStyleSchema = require("../validationjoi/newHairStyle");

async function handleCreateHairStyle(req, res) {
	const { value, error } = haiStyleSchema.validate(req.body);

	if (error) {
		return res.json({ message: error.message }).status(400);
	}

	//check if hairstyle exist in database
	// const found = await HairStyle.findOne({
	// 	where: {
	// 		name: value.name,
	// 	},
	// });

	// if (found) {
	// 	return res.json({ message: "hair style already exists" }).status(400);
	// }
	try {
		const newHairStyle = await HairStyle.create({ ...value });
		console.log(newHairStyle);
		return res.json({ newHairStyle });
	} catch (error) {
		console.log(error, "an error occureddd--------!!!!!", error.message);
		return res.json({ error: error.message }).status(500);
	}
}

//get all appointments belonging to a customer
function handleGetAllHairStyles(req, res) {}

module.exports = { handleCreateHairStyle, handleGetAllHairStyles };
