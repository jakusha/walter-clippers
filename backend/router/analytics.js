const express = require("express");
const { analyticsInfo } = require("../controller/analyticsController");
const api = express.Router();

api.get("/", analyticsInfo);
module.exports = api;
