import 'styled-components';
import { Theme } from './theme-config';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
