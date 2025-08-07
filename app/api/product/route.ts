import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// interface
export interface Product {
  id: number;
  title: string;
  rate: number;
  price: {
    current: number;
    old_price: number;
    discount: number;
  };
  description: string;
  uzum_link: string;
  images: string[];
}

// Fayl manzili
const filePath = path.join(process.cwd(), "db", "products.db.json");
const uploadDir = path.join(process.cwd(), "public", "uploads");

function withCORS(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

//  GET all products
export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(data) as Product[];
    return withCORS(NextResponse.json({ data: parsed }));
  } catch (err) {
    return withCORS(
      NextResponse.json(
        { message: "Xatolik yuz berdi", error: err },
        { status: 500 }
      )
    );
  }
}

// POST product with images
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title")?.toString() || "";
    const rate = parseFloat(formData.get("rate")?.toString() || "0");

    const price = {
      current: parseFloat(formData.get("current")?.toString() || "0"),
      old_price: parseFloat(formData.get("old_price")?.toString() || "0"),
      discount: parseFloat(formData.get("discount")?.toString() || "0"),
    };
    const description = formData.get("description")?.toString() || "";
    const uzum_link = formData.get("uzum_link")?.toString() || "";

    const images: string[] = [];

    // uploads papkasini tekshir, yo'q bo‘lsa yarat
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // Rasmlarni saqlash
    for (const [key, value] of formData.entries()) {
      if (key === "images" && value instanceof File) {
        const ext = path.extname(value.name); // .png, .jpg
        const fileName = `${uuidv4()}${ext}`;
        const filePathToSave = path.join(uploadDir, fileName);

        const buffer = Buffer.from(await value.arrayBuffer());
        await fs.writeFile(filePathToSave, buffer);

        images.push(`/uploads/${fileName}`);
      }
    }

    // Mahsulot yaratish
    const newProduct: Product = {
      id: Date.now(), // yoki UUID
      title,
      rate,
      price,
      description,
      uzum_link,
      images,
    };

    const db = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(db) as Product[];

    parsed.push(newProduct);
    await fs.writeFile(filePath, JSON.stringify(parsed, null, 2));

    return withCORS(
      NextResponse.json({
        message: "Mahsulot qo‘shildi",
        data: newProduct,
      })
    );
  } catch (err) {
    return withCORS(
      NextResponse.json({ message: "Xatolik", error: err }, { status: 500 })
    );
  }
}

// ✅ OPTIONS – CORS
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 204 }));
}
