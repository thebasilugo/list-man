/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		// "./path/to/your/*.html", // Adjust the path for your HTML files
		// "./path/to/your/**/*.js", // Adjust the path for your JS files
		// "./path/to/your/**/*.jsx", // For JSX files (if using React)
		// "./path/to/your/**/*.ts", // For TypeScript files (if using React with TypeScript)
		// "./path/to/your/**/*.tsx", // For JSX/TSX files in TypeScript React apps
	],
	darkMode: "class", // Enable dark mode using class-based toggling
	theme: {
		extend: {
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
			},
			animation: {
				fadeIn: "fadeIn 0.4s ease-in-out",
			},
			colors: {
				"dark-bg": "#262626", // Custom dark background color
				"dark-text": "#e0e0e0", // Custom dark text color
				"dark-hover": "#333333", // Dark mode hover color
				"dark-border": "#444444", // Dark mode border color
			},
		},
	},
	plugins: [],
};
