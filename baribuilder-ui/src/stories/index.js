import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import {BuilderFilterPanelPure} from '../components/catalog/children/BuilderFilterPanel';
import {defaultApolloData, defaultRouterProps} from './constants';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

storiesOf('BuilderFilterPanel', module).add('default', () => (
  <BuilderFilterPanelPure
    {...defaultRouterProps}
    selectedCategory='ALL_PRODUCTS'
    data={{
      ...defaultApolloData,
      CATEGORY: null,
    }}
  />
));