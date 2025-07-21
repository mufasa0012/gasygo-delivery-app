import { ref, push, set } from "firebase/database";
import { database } from "./firebase";
import { Driver, Product } from "./types";

export const addDriver = async (driver: Omit<Driver, 'id'>) => {
  const driversRef = ref(database, 'drivers');
  const newDriverRef = push(driversRef);
  await set(newDriverRef, driver);
  return newDriverRef.key;
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  const productsRef = ref(database, 'products');
  const newProductRef = push(productsRef);
  await set(newProductRef, product);
  return newProductRef.key;
};
