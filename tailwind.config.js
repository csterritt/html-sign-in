/** @type {import('tailwindcss').Config} */
export default {
  content: ['renderer.tsx', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      // https://github.com/system-fonts/modern-font-stacks
      systemui: ['system-ui', 'sans-serif'],
      transitional: [
        'Charter',
        'Bitstream Charter',
        'Sitka Text',
        'Cambria',
        'serif',
      ],
      oldstyle: [
        'Iowan Old Style',
        'Palatino Linotype',
        'URW Palladio L',
        'P052',
        'serif',
      ],
      humanist: [
        'Seravek',
        'Gill Sans Nova',
        'Ubuntu',
        'Calibri',
        'DejaVu Sans',
        'source-sans-pro',
        'sans-serif',
      ],
      geohumanist: [
        'Avenir',
        'Montserrat',
        'Corbel',
        'URW Gothic',
        'source-sans-pro',
        'sans-serif',
      ],
      classhuman: [
        'Optima',
        'Candara',
        'Noto Sans',
        'source-sans-pro',
        'sans-serif',
      ],
      neogrote: [
        'Inter',
        'Roboto',
        'Helvetica Neue',
        'Arial Nova',
        'Nimbus Sans',
        'Arial',
        'sans-serif',
      ],
      monoslab: ['Nimbus Mono PS', 'Courier New', 'monospace'],
      monocode: [
        'ui-monospace',
        'Cascadia Code',
        'Source Code Pro',
        'Menlo',
        'Consolas',
        'DejaVu Sans Mono',
        'monospace',
      ],
      industrial: [
        'Bahnschrift',
        'DIN Alternate',
        'Franklin Gothic Medium',
        'Nimbus Sans Narrow',
        'sans-serif-condensed',
        'sans-serif',
      ],
      roundsans: [
        'ui-rounded',
        'Hiragino Maru Gothic ProN',
        'Quicksand',
        'Comfortaa',
        'Manjari',
        'Arial Rounded MT',
        'Arial Rounded MT Bold',
        'Calibri',
        'source-sans-pro',
        'sans-serif',
      ],
      slabserif: [
        'Rockwell',
        'Rockwell Nova',
        'Roboto Slab',
        'DejaVu Serif',
        'Sitka Small',
        'serif',
      ],
      antique: [
        'Superclarendon',
        'Bookman Old Style',
        'URW Bookman',
        'URW Bookman L',
        'Georgia Pro',
        'Georgia',
        'serif',
      ],
      didone: [
        'Didot',
        'Bodoni MT',
        'Noto Serif Display',
        'URW Palladio L',
        'P052',
        'Sylfaen',
        'serif',
      ],
      handwritten: [
        'Segoe Print',
        'Bradley Hand',
        'Chilanka',
        'TSCu_Comic',
        'casual',
        'cursive',
      ],
    },
    extend: {},
  },

  plugins: [require('daisyui')],

  daisyui: {
    styled: true,

    themes: ['autumn', 'luxury'], // fantasy 1, pastel 2, autumn 3
    darkTheme: 'luxury',
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: '',
  },
}
