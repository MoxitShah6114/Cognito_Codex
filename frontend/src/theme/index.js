// src/theme/index.js
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Custom color palette
const palette = {
  primary: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
    contrastText: '#fff',
  },
  secondary: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
    contrastText: '#fff',
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
  },
  background: {
    default: '#F5F7FA',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#263238',
    secondary: '#546E7A',
  },
};

// Custom typography
const typography = {
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontWeight: 700,
    fontSize: '3.5rem',
  },
  h2: {
    fontWeight: 600,
    fontSize: '3rem',
  },
  h3: {
    fontWeight: 600,
    fontSize: '2.25rem',
  },
  h4: {
    fontWeight: 600,
    fontSize: '2rem',
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.5rem',
  },
  h6: {
    fontWeight: 600,
    fontSize: '1.25rem',
  },
  subtitle1: {
    fontWeight: 500,
    fontSize: '1.125rem',
  },
  button: {
    fontWeight: 600,
    textTransform: 'none',
  },
};

// Custom shadows
const shadows = Array(25)
  .fill('')
  .map((_, i) => {
    if (i === 0) return 'none';
    const y = i > 16 ? 24 : i > 8 ? 16 : 8;
    const opacity = i > 16 ? 0.18 : i > 8 ? 0.14 : 0.1;
    return `0px ${i}px ${y}px rgba(0,0,0,${opacity})`;
  });

// Custom shape
const shape = {
  borderRadius: 12,
};

// Create theme
let theme = createTheme({
  palette,
  typography,
  shadows,
  shape,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.12)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: palette.primary.dark,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
        },
        elevation2: {
          boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)',
        },
        elevation3: {
          boxShadow: '0 6px 20px 0 rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.1)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.2)',
            },
          },
        },
      },
    },
  },
});

// Make typography responsive
theme = responsiveFontSizes(theme);

export default theme;
