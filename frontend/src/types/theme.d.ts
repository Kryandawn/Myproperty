declare module '@/styles/theme' {
  interface ThemeColors {
    darkBlue: string;
    darkGray: string;
    steelBlue: string;
    lightBlue: string;
    lightGray: string;
  }

  interface Theme {
    colors: ThemeColors;
  }

  export const theme: Theme;
}
