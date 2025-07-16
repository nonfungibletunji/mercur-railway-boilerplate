import type { Preview } from '@storybook/react';
import nextIntl from './next-intl';

const preview: Preview = {
  initialGlobals: {
    locale: 'en',
    locales: {
      en: 'English',
    },
  },
  parameters: {
    nextIntl,
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
