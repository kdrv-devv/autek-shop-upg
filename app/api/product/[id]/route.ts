import type { NextApiRequest } from "next";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

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

const filePath = path.join(process.cwd(), "db", "products.db.json");

function withCORS(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

// GET -> Bitta mahsulotni olish (id bo‘yicha)
export async function GET(
  request: Request,
  { params } : { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const products = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(products) as Product[];

    const found = parsed.find((el) => el.id === id);
    if (!found) {
      return withCORS(
        NextResponse.json(
          { message: `ID ${id} ga teng bo‘lgan mahsulot topilmadi` },
          { status: 404 }
        )
      );
    }

    return withCORS(NextResponse.json({ data: found }));
  } catch (err) {
    return withCORS(
      NextResponse.json({ message: "Xatolik yuz berdi", error: err }, { status: 500 })
    );
  }
}

// PUT -> Yangilash
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const updateData = body.data || body;
    
    const data = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(data) as Product[];

    const index = parsed.findIndex((el) => el.id === id);
    
    if (index === -1) {
      return withCORS(
        NextResponse.json({ message: `ID ${id} topilmadi` }, { status: 404 })
      );
    }

    parsed[index] = {
      ...parsed[index],
      ...updateData,
      id, 
    };

    await fs.writeFile(filePath, JSON.stringify(parsed, null, 2));

    return withCORS(
      NextResponse.json({
        message: "Mahsulot muvaffaqiyatli yangilandi",
        data: parsed[index],
      })
    );
  } catch (err) {
    return withCORS(
      NextResponse.json({ message: "Xatolik", error: err }, { status: 500 })
    );
  }
}

// DELETE -> O‘chirish
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const products = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(products) as Product[];

    const exists = parsed.find((el) => el.id === id);
    if (!exists) {
      return withCORS(
        NextResponse.json({ message: `ID ${id} topilmadi` }, { status: 404 })
      );
    }

    const filtered = parsed.filter((el) => el.id !== id);
    await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));

    return withCORS(
      NextResponse.json({ message: "Mahsulot o‘chirildi" })
    );
  } catch (err) {
    return withCORS(
      NextResponse.json({ message: "Xatolik", error: err }, { status: 500 })
    );
  }
}

// OPTIONS -> CORS uchun
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 204 }));
}
