import gql from 'graphql-tag';
import * as React from 'react';
import {SFC} from 'react';
import {ChildDataProps, graphql} from 'react-apollo';
import {branch, compose, pure, renderComponent} from 'recompose';
import {GetProductForProductDetail, GetProductForProductDetailVariables} from '../../../../typings/gql/GetProductForProductDetail';

const GET_PRODUCT_QUERY = gql`
    query GetProductForProductDetail($id: ID) {
        Product(id: $id) {
            id
            listings {
                price {
                    amount
                }
                numServings
            }
            nutritionFacts {
                ingredients {
                    ingredientQuantity {
                        amount
                        units
                    }
                    ingredientType {
                        name
                    }
                }
            }
            defaultQuantity @client {
                number
                units
                frequency
            }
            cost @client {
                money
                frequency
            }
            projectedRegimenCost @client {
                numRemainingProducts
                cost {
                    money
                    frequency
                }
            }
        }
    }
`;

interface IProps {
  id: string
}

type DataOutputProps = ChildDataProps<IProps, GetProductForProductDetail, GetProductForProductDetailVariables>;

const data = graphql<IProps, GetProductForProductDetail, GetProductForProductDetailVariables, DataOutputProps>(GET_PRODUCT_QUERY, {
  options: ({ id }) => ({
    variables: { id },
  }),
});

const displayLoadingState = branch<DataOutputProps>(
  (props) => props.data.loading,
  renderComponent(() => <div>Loading</div>),
);

const enhance = compose<IProps & DataOutputProps, IProps>(
  data,
  displayLoadingState,
  pure,
);

// Pure
const ProductPure: SFC<IProps & DataOutputProps> = ({data: { Product }, id}) => {
  return <div>{Product === null || Product === undefined ? null : `${id}; ${Product.defaultQuantity.number}; ${Product.cost.money}; ${Product.projectedRegimenCost.cost.money}`}</div>;
};

export default enhance(ProductPure);
