/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-1': '#15234D',
        'space-2': '#101A33',
        'sun-1': '#FF7000',
        'sun-2': '#F1AD00',
        'orbit-1': '#0965FA',
        'orbit-2': '#00B2DD',
        'cloud': '#EFF6FF',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        launchFade: {
          '0%, 20%': { opacity: '1' },
          '28%': { opacity: '0' },
          '96%, 100%': { opacity: '0' },
        },
        portalGrow: {
          '0%, 16%': { width: '10px', height: '10px', opacity: '0' },
          '24%': { width: '180px', height: '180px', opacity: '1' },
          '32%, 100%': { width: '10px', height: '10px', opacity: '0' },
        },
        lidTop: {
          '0%, 26%': { transform: 'translateY(-100%)' },
          '29%': { transform: 'translateY(0%)' },
          '42%, 100%': { transform: 'translateY(-100%)' },
        },
        lidBottom: {
          '0%, 26%': { transform: 'translateY(100%)' },
          '29%': { transform: 'translateY(0%)' },
          '42%, 100%': { transform: 'translateY(100%)' },
        },
        galaxyFade: {
          '0%, 27%': { opacity: '0' },
          '32%, 90%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        windFade: {
          '0%, 44%': { opacity: '0' },
          '48%, 60%': { opacity: '1' },
          '64%, 100%': { opacity: '0' },
        },
        logoFade: {
          '0%, 56%': { opacity: '0', transform: 'scale(0.85)' },
          '62%, 84%': { opacity: '1', transform: 'scale(1)' },
          '90%, 100%': { opacity: '0', transform: 'scale(1.05)' },
        },
        wipeAcross: {
          '0%, 88%': { transform: 'translateX(-100%)' },
          '98%, 100%': { transform: 'translateX(0%)' },
        },
        flamePulse: {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(1.2)', opacity: '1' },
        },
        streakUp: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-160vh)' },
        },
        ringSpin: {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
      },
      animation: {
        launchFade: 'launchFade 20s linear infinite',
        portalGrow: 'portalGrow 20s ease-in-out infinite',
        lidTop: 'lidTop 20s ease-in-out infinite',
        lidBottom: 'lidBottom 20s ease-in-out infinite',
        galaxyFade: 'galaxyFade 20s ease-in-out infinite',
        windFade: 'windFade 20s ease-in-out infinite',
        logoFade: 'logoFade 20s ease-in-out infinite',
        wipeAcross: 'wipeAcross 20s ease-in-out infinite',
        flamePulse: 'flamePulse 0.5s ease-in-out infinite alternate',
        streakUp: 'streakUp 0.6s linear infinite',
        ringSpin: 'ringSpin 20s linear infinite',
      },
    },
  },
  plugins: [],
}
