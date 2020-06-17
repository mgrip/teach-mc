// import original module declarations
import "styled-components";
import { Theme } from "../src/theme";

// and extend them!
declare module "styled-components" {
  // eslint-disable-next-line
  export interface DefaultTheme extends Theme {}
}
