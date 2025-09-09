import React from 'react';
import {ColorModeProvider} from '@docusaurus/theme-common/internal';

export default function Root({children}) {
  return <ColorModeProvider>{children}</ColorModeProvider>;
}
