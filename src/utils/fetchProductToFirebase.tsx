import { db } from '@src/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export const fetchSmarhphonesToFireBase = async (products: any, type: string) => {
  try {
    products[type].forEach(async (product: any) => {
      await setDoc(doc(db, type, product.product.id), {
        ...product,
      });
    });
  } catch (error) {
    console.log(error);
  }
};
