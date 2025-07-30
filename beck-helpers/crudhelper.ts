import fs from "fs/promises";
import path from "path";

export interface BaseItem {
  id: number;
  [key: string]: any;
}


// Fayldan o'qib olish
export async function readData<T extends BaseItem>(filePath: string): Promise<T[]> {
  const data = await fs.readFile(path.resolve(filePath), "utf-8");
  return JSON.parse(data) as T[];
}


// Faylga yozib qo'yish
export async function writeData<T>(filePath: string, data: T[]): Promise<void> {
  await fs.writeFile(path.resolve(filePath), JSON.stringify(data, null, 2));
}


// Ma'lumot qo'shish
export async function addItem<T extends BaseItem>(filePath: string, newItem: T): Promise<T[]> {
  const items = await readData<T>(filePath);
  items.push(newItem);
  await writeData(filePath, items);
  return items;
}

// Ma'lumot yangilash
export async function updateItem<T extends BaseItem>(filePath: string, updatedItem: T): Promise<T[]> {
  const items = await readData<T>(filePath);
  const updatedItems = items.map(item => item.id === updatedItem.id ? { ...item, ...updatedItem } : item);
  await writeData(filePath, updatedItems);
  return updatedItems;
}

// Ma'lumotni o'chirish
export async function deleteItem<T extends BaseItem>(filePath: string, id: number): Promise<T[]> {
  const items = await readData<T>(filePath);
  const filteredItems = items.filter(item => item.id !== id);
  await writeData(filePath, filteredItems);
  return filteredItems;
}
