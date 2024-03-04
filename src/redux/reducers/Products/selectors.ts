import { IProductCartItem } from '@src/redux/models';
import { RootState } from '@src/redux/store';

export const selectCartItemById = (id: string) => (state: RootState) =>
  state.products.cartProducts.find((item: IProductCartItem) => item.product.id === id);

export const selectProductToOrdering = (id: string) => (state: RootState) =>
  state.products.productToOrdering.find((item: IProductCartItem) => item.product.id === id);
