/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#1e1e1e',
    surface: '#333333',
    primary: '#ffcaaf',
    'primary-darken-1': '#DB5A4E',
    secondary: '#4ECDC4',
    'secondary-darken-1': '#3AA39D',
    error: '#FF0033',
    info: '#FFD166',
    success: '#00B159',
    warning: '#FF851B',
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    },
  },
})
