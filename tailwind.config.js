/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-gray': '#FAF9F6',
        'custom-dark-gray':'#767676',
        'custome-blue':'#005AE6',
        // 'custome-light-gray':'#B5B5B5'
        
      },
    },
  },
  plugins: [],
}

