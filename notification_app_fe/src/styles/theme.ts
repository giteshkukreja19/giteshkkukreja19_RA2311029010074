/**
 * Material UI Theme
 * ─────────────────
 * Custom MUI theme for Campus Notification System.
 * Clean, professional, accessible color palette.
 */

import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    placement: Palette['primary'];
    result: Palette['primary'];
    event: Palette['primary'];
  }
  interface PaletteOptions {
    placement?: PaletteOptions['primary'];
    result?: PaletteOptions['primary'];
    event?: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0',
      light: '#1976D2',
      dark: '#0D47A1',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F57C00',
      light: '#FF9800',
      dark: '#E65100',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#2E7D32',
      light: '#43A047',
      dark: '#1B5E20',
    },
    warning: {
      main: '#E65100',
      light: '#FF6D00',
      dark: '#BF360C',
    },
    info: {
      main: '#0277BD',
      light: '#0288D1',
      dark: '#01579B',
    },
    background: {
      default: '#F0F4F8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A2027',
      secondary: '#546E7A',
    },
    divider: '#E0E7EF',
    placement: {
      main: '#1B5E20',
      light: '#E8F5E9',
      dark: '#145214',
      contrastText: '#FFFFFF',
    },
    result: {
      main: '#E65100',
      light: '#FFF3E0',
      dark: '#BF360C',
      contrastText: '#FFFFFF',
    },
    event: {
      main: '#01579B',
      light: '#E3F2FD',
      dark: '#013E7B',
      contrastText: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500 },
    body1: { fontWeight: 400, lineHeight: 1.6 },
    body2: { fontWeight: 400, lineHeight: 1.5 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderRadius: 12,
          transition: 'box-shadow 0.2s ease, transform 0.15s ease',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0,0,0,0.14)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: '0.3px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
