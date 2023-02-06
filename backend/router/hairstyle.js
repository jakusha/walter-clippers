const express = require("express");
const api = express.Router();

const {
	handleGetAllHairStyles,
	handleCreateHairStyle,
	handleUpdateHairStyle,
	handleDeleteHairStyle,
} = require("../controller/hairStyleController");

api.get("/", handleGetAllHairStyles);
api.post("/", handleCreateHairStyle);
api.put("/:hairStyleId", handleUpdateHairStyle);
api.delete("/:hairStyleId", handleDeleteHairStyle);

module.exports = api;
