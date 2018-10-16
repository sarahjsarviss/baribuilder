import {Grid} from '@material-ui/core';
import {keyBy} from 'lodash';
import * as React from 'react';
import {Fragment, SFC} from 'react';
import styled from 'styled-components';
import Sketch from '../../app/style/SketchVariables';
import {
  GetCatalogProducts_allCatalogProducts,
  GetCatalogProducts_allClientCatalogProducts,
  GetCatalogProducts_searchQuery
} from '../../typings/gql/GetCatalogProducts';
import {ROOT_CATEGORY, SORTING_STRATEGY} from './CatalogScreen';
import BuilderFilterPanel from './children/BuilderFilterPanel';
import BuilderHeader from './children/BuilderHeader';
import BuilderMainPanel from './children/BuilderMainPanel';
import BuilderMyProducts from './children/BuilderMyProducts';
import BuilderMyRegimen from './children/BuilderMyRegimen';

export type SetBuilderStateFunction = (value: boolean) => void;

interface IProps {
  showMyProducts: boolean;
  setShowMyProducts: SetBuilderStateFunction;
  showMyRegimen: boolean;
  setShowMyRegimen: SetBuilderStateFunction;
  sortingStrategy: SORTING_STRATEGY;
  searchQuery: GetCatalogProducts_searchQuery;
  allCatalogProducts: GetCatalogProducts_allCatalogProducts[];
  clientCatalogProducts: GetCatalogProducts_allClientCatalogProducts[];
  selectedCategory: string;
}

const TabGrid = styled(Grid)`
  background-color: white;
  box-shadow: -2px 0px 4px 0px ${Sketch.color.accent.grey};
  max-height: 100vh;
  position: sticky;
  top: 0;
`;

// search query, filters, and category
const filterClientCatalogProducts = (
  clientCatalogProducts: GetCatalogProducts_allClientCatalogProducts[],
  searchQuery: GetCatalogProducts_searchQuery | undefined,
  allCatalogProducts: GetCatalogProducts_allCatalogProducts[] | undefined,
  selectedCategory: string,
): GetCatalogProducts_allClientCatalogProducts[] => {
  const catalogProductsById = keyBy(allCatalogProducts, product => product.id);
  if (searchQuery && searchQuery.value) {
    const lowercaseSearchQuery = searchQuery.value.toLowerCase();
    return clientCatalogProducts.filter(product => (
      // category & search
      selectedCategory === ROOT_CATEGORY || catalogProductsById[product.catalogProductId].category === selectedCategory
      && (
        catalogProductsById[product.catalogProductId].name.toLowerCase().includes(lowercaseSearchQuery) ||
        catalogProductsById[product.catalogProductId].brand.toLowerCase().includes(lowercaseSearchQuery)
      )
    ));
  } else {
    return clientCatalogProducts.filter(product => (
      // just search
      selectedCategory === ROOT_CATEGORY || catalogProductsById[product.catalogProductId].category === selectedCategory
    ));
  }
};

const CatalogScreenPure: SFC<IProps> = props => {
  const {showMyProducts, showMyRegimen} = props;
  const numColumnsForFilter = showMyProducts && showMyRegimen ? null : 2;
  // @ts-ignore can't figure out my math
  const numColumnsForMain: 10 | 7 | 6 | 5 = 10 - (showMyProducts ? 3 : 0) - (showMyRegimen ? 4 : 0) + (showMyProducts && showMyRegimen ? 2 : 0);
  const isMyRegimenOnRight = !showMyProducts && showMyRegimen;

  const filteredClientCatalogProducts = filterClientCatalogProducts(props.clientCatalogProducts, props.searchQuery, props.allCatalogProducts, props.selectedCategory);

  return (
    <Fragment>
      <BuilderHeader
        {...props}
        isMyRegimenOnRight={isMyRegimenOnRight}
        selectedCategory={props.selectedCategory}
        filteredClientCatalogProducts={filteredClientCatalogProducts}
      />
      <Grid container spacing={0}>
        {
          numColumnsForFilter === null ? null : (
            <Grid item lg={numColumnsForFilter}>
              <BuilderFilterPanel selectedCategory={props.selectedCategory}/>
            </Grid>
          )
        }
        {/* @ts-ignore Can't figure out my math*/}
        <Grid item lg={numColumnsForMain}>
          <BuilderMainPanel
            selectedCategory={props.selectedCategory}
            key={props.selectedCategory}
            sortingStrategy={props.sortingStrategy}
            filteredClientCatalogProducts={filteredClientCatalogProducts}
          />
        </Grid>
        {
          showMyRegimen && !isMyRegimenOnRight ? (
            <TabGrid item lg={4}>
              <BuilderMyRegimen/>
            </TabGrid>
          ) : null
        }
        {
          !showMyProducts ? null :
            <TabGrid item lg={3}>
              <BuilderMyProducts/>
            </TabGrid>
        }
        {
          showMyRegimen && isMyRegimenOnRight ? (
            <TabGrid item lg={4}>
              <BuilderMyRegimen/>
            </TabGrid>
          ) : null
        }
      </Grid>
    </Fragment>
  );
};

export default CatalogScreenPure;