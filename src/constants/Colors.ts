export const Colors = {
  // Paleta Brasil
  primary: {
    50: '#F0FDF4', // Verde muito claro
    100: '#DCFCE7', // Verde claro
    200: '#BBF7D0', // Verde suave
    300: '#86EFAC', // Verde médio claro
    400: '#4ADE80', // Verde médio
    500: '#22C55E', // Verde principal
    600: '#16A34A', // Verde escuro
    700: '#15803D', // Verde mais escuro
    800: '#166534', // Verde muito escuro
    900: '#14532D', // Verde mais escuro ainda
  },

  secondary: {
    50: '#FFFBEB', // Amarelo muito claro
    100: '#FEF3C7', // Amarelo claro
    200: '#FDE68A', // Amarelo suave
    300: '#FCD34D', // Amarelo médio claro
    400: '#FBBF24', // Amarelo médio
    500: '#F59E0B', // Amarelo principal
    600: '#D97706', // Amarelo escuro
    700: '#B45309', // Amarelo mais escuro
    800: '#92400E', // Amarelo muito escuro
    900: '#78350F', // Amarelo mais escuro ainda
  },

  accent: {
    50: '#EFF6FF', // Azul muito claro
    100: '#DBEAFE', // Azul claro
    200: '#BFDBFE', // Azul suave
    300: '#93C5FD', // Azul médio claro
    400: '#60A5FA', // Azul médio
    500: '#3B82F6', // Azul principal
    600: '#2563EB', // Azul escuro
    700: '#1D4ED8', // Azul mais escuro
    800: '#1E40AF', // Azul muito escuro
    900: '#1E3A8A', // Azul mais escuro ainda
  },

  // Cores neutras
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Estados
  success: '#22C55E', // Verde
  warning: '#F59E0B', // Amarelo
  error: '#EF4444',
  info: '#3B82F6', // Azul

  // Cores base
  white: '#FFFFFF',
  black: '#000000',

  // Gradientes Brasil
  gradients: {
    brasil: ['#22C55E', '#F59E0B', '#3B82F6'], // Verde, Amarelo, Azul
    primaryToSecondary: ['#22C55E', '#F59E0B'], // Verde para Amarelo
    secondaryToAccent: ['#F59E0B', '#3B82F6'], // Amarelo para Azul
  },
};

// Tema para modo claro
export const lightTheme = {
  background: Colors.white,
  surface: Colors.gray[50],
  primary: Colors.primary[500],
  secondary: Colors.secondary[500],
  accent: Colors.accent[500],
  text: Colors.gray[900],
  textSecondary: Colors.gray[600],
  border: Colors.gray[200],
  placeholder: Colors.gray[400],
};

// Tema para modo escuro
export const darkTheme = {
  background: Colors.gray[900],
  surface: Colors.gray[800],
  primary: Colors.primary[400],
  secondary: Colors.secondary[400],
  accent: Colors.accent[400],
  text: Colors.white,
  textSecondary: Colors.gray[300],
  border: Colors.gray[700],
  placeholder: Colors.gray[500],
};
