/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'
import aspectRatio from '@tailwindcss/aspect-ratio'
import typography from '@tailwindcss/typography'

export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a',950:'#172554' },
        success: { 50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#22c55e',600:'#16a34a',700:'#15803d',800:'#166534',900:'#14532d' },
        warning: { 50:'#fffbeb',100:'#fef3c7',200:'#fde68a',300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309',800:'#92400e',900:'#78350f' },
        danger:  { 50:'#fef2f2',100:'#fee2e2',200:'#fecaca',300:'#fca5a5',400:'#f87171',500:'#ef4444',600:'#dc2626',700:'#b91c1c',800:'#991b1b',900:'#7f1d1d' },
        vehicle: { moving:'#22c55e', charging:'#3b82f6', idle:'#f59e0b', offline:'#ef4444' }
      },
      fontFamily: {
        sans: ['Inter','ui-sans-serif','system-ui','-apple-system','BlinkMacSystemFont','Segoe UI','Roboto','Helvetica Neue','Arial','Noto Sans','sans-serif','Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'],
        mono: ['JetBrains Mono','ui-monospace','SFMono-Regular','Menlo','Monaco','Consolas','Liberation Mono','Courier New','monospace']
      },
      spacing: { '18':'4.5rem','88':'22rem','128':'32rem' },
      animation: { 'pulse-slow':'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite','bounce-slow':'bounce 2s infinite','fade-in':'fadeIn 0.5s ease-in-out','slide-up':'slideUp 0.3s ease-out','slide-down':'slideDown 0.3s ease-out' },
      keyframes: {
        fadeIn:{ '0%':{opacity:'0'}, '100%':{opacity:'1'} },
        slideUp:{ '0%':{transform:'translateY(10px)',opacity:'0'}, '100%':{transform:'translateY(0)',opacity:'1'} },
        slideDown:{ '0%':{transform:'translateY(-10px)',opacity:'0'}, '100%':{transform:'translateY(0)',opacity:'1'} },
      },
      boxShadow: {
        soft:'0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        medium:'0 4px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        large:'0 10px 40px -10px rgba(0,0,0,0.15), 0 20px 25px -5px rgba(0,0,0,0.1)',
      },
      backdropBlur: { xs:'2px' },
      screens: { xs:'475px', '3xl':'1600px' },
    },
  },
  plugins: [
    forms,
    aspectRatio,
    typography,
    function({ addUtilities, theme }) {
      addUtilities({
        '.vehicle-moving':   { backgroundColor: theme('colors.vehicle.moving'),   color: 'white' },
        '.vehicle-charging': { backgroundColor: theme('colors.vehicle.charging'), color: 'white' },
        '.vehicle-idle':     { backgroundColor: theme('colors.vehicle.idle'),     color: 'white' },
        '.vehicle-offline':  { backgroundColor: theme('colors.vehicle.offline'),  color: 'white' },
      })
    },
    function({ addUtilities }) {
      addUtilities({
        '.glass':      { background:'rgba(255,255,255,0.1)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.2)' },
        '.glass-dark': { background:'rgba(0,0,0,0.1)',       backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.1)' },
      })
    },
  ],
}
