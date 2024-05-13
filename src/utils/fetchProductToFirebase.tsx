import { db } from '@src/firebaseConfig';
import { IProductItem } from '@src/redux/models';
import { doc, setDoc } from 'firebase/firestore';

export const fetchProductToFireBase = async (products: IProductItem[], type: string) => {
  try {
    products.forEach(async (product: IProductItem) => {
      await setDoc(doc(db, type, product.product.id), {
        ...product,
      });
    });
  } catch (error) {
    console.log(error);
  }
};
