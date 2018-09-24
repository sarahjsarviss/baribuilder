import {Grid} from '@material-ui/core';
import * as React from 'react';
import {SFC} from 'react';
import styled from 'styled-components';
import {EmptyRow} from '../../style/Layout';
import ProductSelection from './productSelection/CatalogProductSelection';

const PaddedGrid = styled(Grid)`
  padding-left: 8px;
`;

// Pure
const BuilderMainPanel: SFC = () => {
  return (
    <PaddedGrid container alignContent='flex-start'>
      <EmptyRow mobile='1px'/>
      <Grid item container direction='row'>
        <Grid item lg={11} container direction='row' alignContent='flex-start'>
          <Grid item lg={12}>
            <ProductSelection/>
          </Grid>
        </Grid>
        <Grid item lg={1}/>
      </Grid>
      <EmptyRow mobile='1px'/>
    </PaddedGrid>
  )
};

export default BuilderMainPanel;