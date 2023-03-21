const { transform } = require("typescript");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				istok: ["Istok Web", "sans-serif"],
				nunito: ["Nunito", "sans-serif"],
			},
			animation: {
				"header-intro": "header 4s both",
				"header-1": "header1 4s both",
				"header-2": "header2 4s both",
				"splash-screen": "splashScreen 2s both",
				slideUp: "slideUp 1s cubic-bezier(0.5, 0, 0.5, 1) 1.5s",
				slideUpText: "slideUpText 0.7s cubic-bezier(0.5, 0, 0.5, 1)",
				slideUpButton: "slideUpButton 4s cubic-bezier(0.5, 0, 0.5, 1)",
			},
			keyframes: {
				header: {
					"from, 50%": { transform: "translateY(40%) scale(1.5)" },
					to: {
						transform: "none",
					},
				},
				header2: {
					"from, 50%": { opacity: "0" },
					to: { opacity: "1" },
				},
				header1: {
					from: { opacity: "0" },
					"50%, to": { opacity: "1" },
				},
				splashScreen: {
					"from, 90%": { opacity: "1", zIndex: 10 },
					to: { opacity: "0", display: "none", zIndex: -10 },
				},
				slideUp: {
					from: { opacity: "0", transform: "scale(0.7)" },
					to: { opacity: "1", transform: "none" },
				},
				slideUpText: {
					from: { opacity: "0", transform: "translateY(70%)" },
					to: { opacity: "1", transform: "none" },
				},
				slideUpButton: {
					"from, 70%": { opacity: "0", transform: "translateY(70%)" },
					to: { opacity: "1", transform: "none" },
				},
			},
		},
	},
	plugins: [],
};
