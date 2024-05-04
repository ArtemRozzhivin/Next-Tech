import { db } from '@src/firebaseConfig';
import { IProductItem } from '@src/redux/models';
import { IUserHistory, productsActions } from '@src/redux/reducers/Products/products';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { getUserHistory } from './user';
import { User } from '@src/models/user';

export const handleAddToWishList = async (
  product: IProductItem,
  userHistory: null | IUserHistory,
  user: User | null,
  dispatch: any,
) => {
  if (user) {
    try {
      const productRef = doc(db, 'users', user.uid);
      const productToWishlist = {
        product: product.product,
        image: product.image,
      };

      if (userHistory?.wishlist?.find((item) => item.product.id === productToWishlist.product.id)) {
        await updateDoc(productRef, {
          user: user.uid,
          wishlist: arrayRemove(productToWishlist),
        });
      } else {
        await updateDoc(productRef, {
          user: user.uid,
          wishlist: arrayUnion(productToWishlist),
        });
      }
    } catch (error) {
      console.log(error);
    }

    getUserHistory(user).then((userHistory) => {
      if (userHistory) dispatch(productsActions.setUserHistory(userHistory as IUserHistory));
    });
  }
};
