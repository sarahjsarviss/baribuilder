import {FREQUENCY, PRODUCT_QUANTITY_UNITS} from '../typings/gql/globalTypes';
import {IDesiredIngredients, IRegimen} from './client-schema-types';

export interface IApolloStateShape {
  currentRegimen: IRegimen;
  desiredIngredients: IDesiredIngredients;
}

const defaults: IApolloStateShape = {
  currentRegimen: {
    __typename: 'Regimen',
    products: [
      {
        __typename: 'RegimenProduct',
        catalogProductId: 'cjm0rzfrj1sdp0138x3hhr3us',
        quantity: {
          amount: 5,
          __typename: 'ProductQuantity',
          frequency: FREQUENCY.DAILY,
          units: PRODUCT_QUANTITY_UNITS.SERVINGS,
        },
        cost: {
          __typename: 'Cost',
          money: 50.4,
          frequency: FREQUENCY.MONTHLY,
        }
      },
    ],
  },
  desiredIngredients: {
    __typename: 'DesiredIngredients',
    ingredientRanges: [],
  }
};

export default defaults;
