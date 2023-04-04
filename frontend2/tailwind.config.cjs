/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				istok: ["Istok Web", "sans-serif"],
				nunito: ["Nunito", "sans-serif"],
				montserrat: ["Montserrat", "sans-serif"],
			},
			colors: {
				"blue-1": "#1E3A8A",
				"blue-2": "#3B82F6",
				"blue-3": "#1D4ED8",
				"blue-4": "#07051C",
				"white-1": "#FFFFFF",
				"white-2": "#F7FAFC",
				"white-3": "#F5F5F5",
				"green-1": "#29DEF1",
			},
			animation: {
				"header-intro": "header 4s both",
				"header-1": "header1 4s both",
				"header-2": "header2 4s both",
				"splash-screen": "splashScreen 2s both",
				slideUp: "slideUp 1s cubic-bezier(0.5, 0, 0.5, 1) 1.5s",
				slideUpText: "slideUpText 0.7s cubic-bezier(0.5, 0, 0.5, 1)",
				slideUpButton: "slideUpButton 4s cubic-bezier(0.5, 0, 0.5, 1)",
				shake: "shake 2s cubic-bezier(0.5, 0, 0.5, 1) 2",
				modal: "modal 0.5s cubic-bezier(0.5, 0, 0.5, 1) both",
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
				shake: {
					" 20%,40%,60%, 80%": {
						transform: "translateX(2%)",
					},
					"10%,30%,50%,70%,90%": {
						transform: "translateX(-2%)",
					},
					"from , to": {
						transform: "none",
					},
				},
				modal: {
					from: {
						opacity: "0",
					},
					to: { opacity: "1" },
				},
			},
		},
	},
	plugins: [],
};
