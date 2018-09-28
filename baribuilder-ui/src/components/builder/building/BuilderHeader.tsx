import {Button, Grid} from '@material-ui/core';
import {fade} from '@material-ui/core/styles/colorManipulator';
import gql from "graphql-tag";
import {upperFirst} from 'lodash';
import * as React from 'react';
import {SFC} from 'react';
import {ChildDataProps, graphql} from 'react-apollo';
import {compose, pure} from 'recompose';
import styled from 'styled-components';
import Sketch from '../../../app/style/SketchVariables';
import {GetProductsForBuilderHeader} from '../../../typings/gql/GetProductsForBuilderHeader';
import {Body} from '../../style/Typography';
import {SetBuilderStateFunction} from '../BuilderScreenPure';

export const builderHeaderHeight = '48px';

interface IProps {
  setShowMyProducts: SetBuilderStateFunction;
  showMyProducts: boolean;
  setShowMyRegimen: SetBuilderStateFunction;
  showMyRegimen: boolean;
  isMyRegimenOnRight: boolean;
  selectedCategory: string;
}

// GraphQL HOC props (output)
type DataOutputProps = ChildDataProps<IProps, GetProductsForBuilderHeader>;

// TODO eventually pass filters & selected category into this query
const data = graphql<{}, GetProductsForBuilderHeader>(gql`
    query GetProductsForBuilderHeader {
        allCatalogProducts {
            id
        }
    }
`);

const enhance = compose<DataOutputProps, IProps>(
  data,
  pure,
);

const FixedGrid = styled(Grid)`
  && {
    height: ${builderHeaderHeight};
    border-bottom: 1px solid ${Sketch.color.accent.grey};
  }
`;

const PaddedCaptionSizedBody = styled(Body)`
  font-size: ${Sketch.typography.caption.fontSize};
  margin-left: 10px;
`;

const NavTabGrid = styled(Grid)`
  && {
    height: 100%;
    box-shadow: -2px 0px 4px 0px ${Sketch.color.accent.grey};
  }
`;

const NavTabButton = styled(Button)`
  && {
    height: 100%;
    background-color: ${Sketch.color.secondary.blue};
    color: ${Sketch.color.accent.white};
    border-radius: 0px;
    text-transform: unset;
    
    :hover {
      background-color: ${fade(Sketch.color.secondary.blue, .8)};
    }
  }
`;

const NavTabButtonActive = styled(NavTabButton)`
  && {
    background-color: white;
    color: ${Sketch.color.accent.black};
    
    :hover {
      background-color: ${fade(Sketch.color.accent.grey, .8)};
    }
  }
`;

// Pure
const BuilderHeaderPure: SFC<DataOutputProps & IProps> = props => {
  const {data: {allCatalogProducts, loading}, showMyProducts, showMyRegimen, isMyRegimenOnRight, selectedCategory} = props;

  const productCount = allCatalogProducts && !loading ? allCatalogProducts.length : undefined;

  let spacingColumnCount: 1 | 2 | 3 | 4 = 4; // !showMyProducts && !showMyRegimen
  if (showMyProducts && !showMyRegimen) {
    spacingColumnCount = 3;
  } else if (showMyProducts && showMyRegimen) {
    spacingColumnCount = 1;
  } else if (!showMyProducts && showMyRegimen) {
    spacingColumnCount = 2;
  }

  return (
    <FixedGrid container direction='row'>
      <Grid item lg={4} container alignItems='center'>
        <Grid item>
          <PaddedCaptionSizedBody dark>
            Showing{productCount ? ` ${productCount} ` : ' '}results in
            &nbsp;<b>{selectedCategory.split('_').map(c => upperFirst(c.toLowerCase())).join(' ')}</b>
          </PaddedCaptionSizedBody>
        </Grid>
      </Grid>
      <Grid item lg={spacingColumnCount}/>
      {isMyRegimenOnRight ? null : <MyRegimenTabHeader {...props}/>}
      <MyProductsTabHeader {...props} style={{zIndex: isMyRegimenOnRight ? 0 : 1}}/>
      {isMyRegimenOnRight ? <MyRegimenTabHeader {...props} style={{zIndex: 1}}/> : null}
    </FixedGrid>
  )
};

// TODO remove ugly style hack
const MyProductsTabHeader: SFC<IProps & { style?: any }> = ({setShowMyProducts, showMyProducts, style}) => {
  const handleMyProductsClick = () => setShowMyProducts(!showMyProducts);
  if (showMyProducts) {
    return (
      <NavTabGrid item lg={3} style={style}>
        <NavTabButtonActive fullWidth onClick={handleMyProductsClick}>My Products</NavTabButtonActive>
      </NavTabGrid>
    );
  }
  return (
    <NavTabGrid item lg={2} style={style}>
      <NavTabButton fullWidth onClick={handleMyProductsClick}>My Products</NavTabButton>
    </NavTabGrid>
  );
};

// TODO remove ugly style hack
const MyRegimenTabHeader: SFC<IProps & { style?: any }> = ({setShowMyRegimen, showMyRegimen, style}) => {
  const handleMyRegimenClick = () => setShowMyRegimen(!showMyRegimen);
  if (showMyRegimen) {
    return (
      <NavTabGrid item lg={4} style={style}>
        <NavTabButtonActive fullWidth onClick={handleMyRegimenClick}>My Regimen</NavTabButtonActive>
      </NavTabGrid>
    );
  }
  return (
    <NavTabGrid item lg={2} style={style}>
      <NavTabButton fullWidth onClick={handleMyRegimenClick}>My Regimen</NavTabButton>
    </NavTabGrid>
  );
};

export default enhance(BuilderHeaderPure);
