const HairStyle = require("../model/HairStyle");
const haiStyleSchema = require("../validationjoi/hairStyles/newHairStyle");

async function handleCreateHairStyle(req, res) {
	const { value, error } = haiStyleSchema.validate(req.body);

	if (error) {
		return res.status(400).json({ message: error.message });
	}

	//check if hairstyle exist in database
	const found = await HairStyle.findOne({
		where: {
			name: value.name,
		},
	});

	if (found) {
		return res.status(400).json({ message: "hair style already exists" });
	}
	try {
		const newHairStyle = await HairStyle.create({ ...value });
		console.log(newHairStyle);
		return res.json({ newHairStyle });
	} catch (error) {
		console.log(error, "an error occureddd--------!!!!!", error.message);
		return res.status(500).json({ error: error.message });
	}
}

//get all appointments belonging to a customer
async function handleGetAllHairStyles(req, res) {
	const hairStyleId = req.params.hairStyleId;

	if (!hairStyleId) {
		return res.status(400).json({ message: "hairstyle id is required" });
	}

	//check if its a valid hairStyleId
	HairStyle.findByPk(hairStyleId);
	try {
		const validHairstyle = await HairStyle.findByPk(hairStyleId);
		if (validHairstyle) {
			const result = await HairStyle.findAll({
				where: {
					hairStyleId,
				},
			});

			return res.json({ hairStyleId, result });
		} else {
			return res.status(400).json({ message: "invalid customer id" });
		}
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

async function handleGetAllHairStyles(req, res) {
	try {
		const hairStyles = await HairStyle.findAll();
		return res.json({ hairStyles });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
async function handleUpdateHairStyle(req, res) {
	const hairStyleId = req.params.hairStyleId;
	const { value, error } = haiStyleSchema.validate(req.body);

	if (error) {
		return res.status(400).json({ message: error.message });
	}

	try {
		//check if hair style id exist
		const found = await HairStyle.findByPk(hairStyleId);

		if (!found) {
			return res
				.status(400)
				.json({ message: "hairstyle id does not exist" });
		}

		//check if hairstyle exist in database
		const foundName = await HairStyle.findOne({
			where: {
				name: value.name,
			},
		});

		if (foundName) {
			return res
				.status(400)
				.json({ message: "hair style already exists" });
		}

		await HairStyle.update(
			{ ...value },
			{
				where: {
					hairStyleId: hairStyleId,
				},
			}
		);

		return res.json({ message: "hairstyle successfully updated" });
	} catch (error) {
		console.log(error, "an error occureddd--------!!!!!", error.message);
		return res.status(500).json({ error: error.message });
	}
}

async function handleDeleteHairStyle(req, res) {
	const hairStyleId = req.params.hairStyleId;

	try {
		//check if hair style id exist
		const found = await HairStyle.findByPk(hairStyleId);

		if (!found) {
			return res
				.status(400)
				.json({ message: "hairstyle id does not exist" });
		}

		//delete hairstyle id
		await HairStyle.destroy({
			where: {
				hairStyleId: hairStyleId,
			},
		});
		return res.json({ message: "hairstyle deleted successfull" });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
module.exports = {
	handleCreateHairStyle,
	handleGetAllHairStyles,
	handleDeleteHairStyle,
	handleUpdateHairStyle,
};
