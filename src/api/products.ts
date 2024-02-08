import { db } from '@src/firebaseConfig';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import { IProductItem } from '@src/redux/models';
import { IUserHistory, productsActions } from '@src/redux/reducers/Products/products';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { getUserHistory } from './user';
import { User } from 'firebase/auth';

export const handleAddToWishList = async (
  product: IProductItem,
  userHistory: null | IUserHistory,
  user: User | null,
  dispatch: any,
) => {
  if (user) {
    try {
      const productRef = doc(db, 'users', user.uid);

      if (userHistory?.wishlist?.find((item) => item.product.id === product.product.id)) {
        await updateDoc(productRef, {
          user: user.uid,
          wishlist: arrayRemove(product),
        });
      } else {
        await updateDoc(productRef, {
          user: user.uid,
          wishlist: arrayUnion(product),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  getUserHistory(user).then((userHistory) => {
    if (userHistory) dispatch(productsActions.setUserHistory(userHistory as IUserHistory));
  });
};
