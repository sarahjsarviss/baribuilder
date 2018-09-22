import {cloneDeep, keyBy} from 'lodash';
import {GetAllProductsIngredients_allProducts} from '../../../typings/gql/GetAllProductsIngredients';
import {FREQUENCY} from '../../../typings/gql/globalTypes';
import {ICost, IIngredientRange, IRegimenIngredient, IRegimenProduct} from '../../client-schema-types';
import {ingredientPricesByName} from '../data/ingredientPrices';
import {IProductForProjectedRegimenCost} from './product_projectedRegimenCost';

// TODO some sort of standardization for unexpected input handling (e.g. propogate toErrorBoundary)

/**
 * Returns non-range ingredients with the minimum desired as a reference point. If the existing exceeds the
 * minimum, will omit from the results. Assumes minimum of 0 if not set.
 */
export const subtractRegimenIngredientsFromDesiredIngredientRanges = (
  regimenProducts: IRegimenProduct[],
  desiredIngredientRanges: IIngredientRange[],
  products: GetAllProductsIngredients_allProducts[],
): IRegimenIngredient[] => {
  const regimenIngredientsByName = calculateRegimenIngredients(regimenProducts, products);
  const results: IRegimenIngredient[] = [];

  desiredIngredientRanges.forEach(range => {
    const result = subtractRegimenIngredientFromMinimumIngredient(range, regimenIngredientsByName[range.ingredientType.name]);
    if (result !== null && result.ingredientQuantity.amount > 0) {
      results.push(result)
    }
  });

  return results;
};

/**
 * Returns the same regimenIngredients minus the aggregate of the ingredients found in product.
 */
export const subtractProductFromRegimenIngredients = (
  regimenIngredients: IRegimenIngredient[],
  product: GetAllProductsIngredients_allProducts,
): IRegimenIngredient[] => {
  if (product.nutritionFacts.ingredients === null) {
    console.warn(`Ingredients shouldn\'t be null. Error code 58938238. Product ID: ${product.id}`);
    return [];
  }

  const productIngredientsByName = keyBy(product.nutritionFacts.ingredients, i => i.ingredientType.name);
  return regimenIngredients.map(regimenIngredient => {
    if (productIngredientsByName.hasOwnProperty(regimenIngredient.ingredientType.name)) {
      if (regimenIngredient.ingredientQuantity.units === productIngredientsByName[regimenIngredient.ingredientType.name].ingredientQuantity.units) {
        return {
          ...regimenIngredient,
          ingredientQuantity: {
            ...regimenIngredient.ingredientQuantity,
            amount: regimenIngredient.ingredientQuantity.amount - productIngredientsByName[regimenIngredient.ingredientType.name].ingredientQuantity.amount,
          }
        }
      } else {
        console.warn('Unit conversions unsupported. Error code 58938238');
      }
    }
    return regimenIngredient;
  })
};

// NB: "project" is a verb here
export const projectCostOfIngredients = (ingredients: IRegimenIngredient[]): ICost => {
  let totalMoney = 0.0;
  const frequency = ingredients.length > 0 ? ingredients[0].frequency : FREQUENCY.DAILY;

  ingredients.forEach(ingredient => {
    if (ingredient.frequency === frequency) {
      const ingredientPrice = ingredientPricesByName[ingredient.ingredientType.name];
      if (ingredientPrice) {
        if (ingredientPrice.units === ingredient.ingredientQuantity.units) {
          totalMoney += ingredientPrice.price * ingredient.ingredientQuantity.amount;
        } else {
          console.warn('Unit conversions unsupported. Error code 10493.');
        }
      } else {
        console.warn(`Missing ingredientPrice for ${ingredient.ingredientType.name}`)
      }
    } else {
      console.warn('Frequency conversions unsupported. Error code 10493.');
    }
  });
  return {
    __typename: 'Cost',
    money: totalMoney,
    frequency,
  };
};

export const sumCostOfProducts = (regimenProducts: IProductForProjectedRegimenCost[]): ICost => {
  let totalMoney = 0.0;
  const frequency = regimenProducts.length > 0 ? regimenProducts[0].quantity.frequency : FREQUENCY.DAILY;
  regimenProducts.forEach(product => {
    if (product.quantity.frequency === frequency) {
      totalMoney += product.quantity.number;
    } else {
      console.warn('Frequency conversions unsupported. Error code 69821.');
    }
  });
  return {
    __typename: 'Cost',
    money: totalMoney,
    frequency,
  };
};

export const sumCosts = (...costs: ICost[]): ICost => {
  if (costs.length == 1) {
    return costs[0];
  } else if (costs.length == 2) {
    if (costs[0].frequency !== costs[1].frequency) {
      console.warn('Frequency conversions unsupported. Error code 09204');
    }

    return {
      ...cloneDeep(costs[0]),
      money: costs[0].money + costs[1].money,
    }
  }

  return sumCosts(costs[0], ...costs.slice(1));
};

/**
 * Below are local helpers. In the weeds.
 */

interface IRegimenIngredientsByName {
  [key: string]: IRegimenIngredient;
}

const calculateRegimenIngredients = (
  regimenProducts: IRegimenProduct[],
  products: GetAllProductsIngredients_allProducts[]
): IRegimenIngredientsByName => {
  const productsById = keyBy(products, product => product.id);

  const result: IRegimenIngredientsByName = {};
  regimenProducts.forEach(product => {
    const ingredients = productsById[product.id].nutritionFacts.ingredients;
    if (ingredients !== null) {
      ingredients.forEach(ingredient => {
        const regimenIngredient: IRegimenIngredient = {
          ...cloneDeep(ingredient),
          ingredientQuantity: {
            ...cloneDeep(ingredient.ingredientQuantity),
            amount: ingredient.ingredientQuantity.amount * product.quantity.number,
          },
          frequency: product.quantity.frequency,
        };

        if (!result.hasOwnProperty(ingredient.ingredientType.name)) {
          result[ingredient.ingredientType.name] = regimenIngredient;
        } else {
          const totalRegimenIngredients = sumRegimenIngredients(result[ingredient.ingredientType.name], regimenIngredient);
          if (totalRegimenIngredients !== null) {
            result[ingredient.ingredientType.name] = totalRegimenIngredients;
          }
        }
      })
    } else {
      console.warn(`Ingredients shouldn\'t be null. Error code 589238. Product ID: ${product.id}`);
    }
  });

  return result;
};

const sumRegimenIngredients = (...ingredients: IRegimenIngredient[]): IRegimenIngredient | null => {
  if (ingredients.length == 1) {
    return ingredients[0];
  } else if (ingredients.length == 2) {
    if (ingredients[0].ingredientType.name !== ingredients[1].ingredientType.name) {
      console.error(`${ingredients[0].ingredientType.name} !== ${ingredients[1].ingredientType.name}. This shouldn't happen. Error code 434829.`);
      return null;
    }
    if (ingredients[0].ingredientQuantity.units !== ingredients[1].ingredientQuantity.units) {
      console.warn('Unit conversions unsupported. Error code 434829');
      return null;
    }

    return {
      ...cloneDeep(ingredients[0]),
      ingredientQuantity: {
        ...cloneDeep(ingredients[0].ingredientQuantity),
        amount: ingredients[0].ingredientQuantity.amount + ingredients[1].ingredientQuantity.amount,
      }
    }
  }

  return sumRegimenIngredients(ingredients[0], ...ingredients.slice(1));
};

const subtractRegimenIngredientFromMinimumIngredient = (
  range: IIngredientRange,
  regimenIngredient: IRegimenIngredient
): IRegimenIngredient | null => {
  const {minimumIngredientQuantity} = range;
  // Assume 0 minimum if not set
  const minimumIngredientQuantityAmount = minimumIngredientQuantity === null ? 0 : minimumIngredientQuantity.amount;

  if (range.ingredientType.name !== regimenIngredient.ingredientType.name) {
    console.error(`${range.ingredientType.name} !== ${regimenIngredient.ingredientType.name}. This shouldn't happen. Error code 489293.`);
    return null;
  }
  if (range.frequency !== regimenIngredient.frequency) {
    console.warn('Frequency conversions unsupported. Error code 489293.');
    return null;
  }
  if (minimumIngredientQuantity !== null) {
    if (minimumIngredientQuantity.units !== regimenIngredient.ingredientQuantity.units) {
      console.warn('Ingredient conversions unsupported. Error code 489293.');
      return null;
    }
  }

  return {
    ...cloneDeep(regimenIngredient),
    ingredientQuantity: {
      ...cloneDeep(regimenIngredient.ingredientQuantity),
      amount: minimumIngredientQuantityAmount - regimenIngredient.ingredientQuantity.amount,
    },
  }
};