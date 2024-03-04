import { db } from '@src/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export const fetchproductToFireBase = async (products: any, type: string) => {
  try {
    products.forEach(async (product: any) => {
      await setDoc(doc(db, type, product.product.id), {
        ...product,
      });
    });
  } catch (error) {
    console.log(error);
  }
};
