const theme = {
  colors: {
    primary: "#D9EEF2",
    secondary: "#CCD3E1",
    tertiary: "#1B3F64",
    quaternary: "#4D4D7A",
    quinary: "#CCD3E1",
    gray: {
      one: "#F2F2F2",
      two: "#E0E0E0",
      three: "#828282",
      four: "#4F4F4F",
    },
  },
  fonts: {
    header: '"Source Code Pro", Helvetica, Arial, sans-serif',
    text: '"Open Sans", Helvetica, Arial, sans-serif',
    monospace: '"Source Code Pro", monospace',
  },
  fontSizes: {
    h1: "72px",
    h2: "64px",
    h3: "56px",
    text: "44px",
    monospace: "20px",
  },
  space: [16, 24, 32],
};

export type Theme = typeof theme;

export default theme;
