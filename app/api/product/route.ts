import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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
  full_description: string; // ""qo‘shildi
  uzum_link: string;
  image: string; // ""bitta rasm
  category: string; // ""qo‘shildi
}

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



 export async function GET() { try { const data = await fs.readFile(filePath, "utf-8"); const parsed = JSON.parse(data) as Product[]; return withCORS(NextResponse.json({ data: parsed })); } catch (err) { return withCORS( NextResponse.json( { message: "Xatolik yuz berdi", error: err }, { status: 500 } ) ); } }


// POST product with single image
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
    const full_description = formData.get("full_description")?.toString() || "";
    const uzum_link = formData.get("uzum_link")?.toString() || "";
    const category = formData.get("category")?.toString() || "";

    // "faqat bitta rasm olish
    const imageFile = formData.get("image") as File | null;
    let imagePath = "";

    if (imageFile && imageFile instanceof File) {
      try {
        await fs.access(uploadDir);
      } catch {
        await fs.mkdir(uploadDir, { recursive: true });
      }

      const ext = path.extname(imageFile.name); // .png, .jpg
      const fileName = `${uuidv4()}${ext}`;
      const filePathToSave = path.join(uploadDir, fileName);

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      await fs.writeFile(filePathToSave, buffer);

      imagePath = `/uploads/${fileName}`;
    }

    // Mahsulot yaratish
    const newProduct: Product = {
      id: Date.now(),
      title,
      rate,
      price,
      description,
      full_description,
      uzum_link,
      image: imagePath,
      category,
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

// OPTIONS – CORS
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 204 }));
}
