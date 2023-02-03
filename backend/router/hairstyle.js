const express = require("express");
const api = express.Router();

const {
	handleGetAllHairStyles,
	handleCreateHairStyle,
} = require("../controller/hairStyleController");

api.get("/", handleGetAllHairStyles);
api.post("/", handleCreateHairStyle);

module.exports = api;
