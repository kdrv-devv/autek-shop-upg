import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

interface Product {
  id: number;
  main_text: string;
  tag_line: string;
  price: {
    current: number;
    old: number;
    discount: number;
  };
  image: string;
}

const filePath = path.join(process.cwd(), "db", "showcase.db.json");

function withCORS(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const showcases = JSON.parse(data);
    return withCORS(NextResponse.json({ data: showcases }));
  } catch (error) {
    return withCORS(
      NextResponse.json(
        { message: "Xatolik yuz berdi", error },
        { status: 500 }
      )
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // Kelayotgan ma'lumotlar
    const { id, main_text, tag_line, image, price } = body as Product;

    if (!id) {
      return withCORS(
        NextResponse.json({ message: "ID ko‘rsatilmagan" }, { status: 400 })
      );
    }

    // JSON fayldan mavjud ma'lumotni o‘qish
    const data = await fs.readFile(filePath, "utf-8");
    const showcases: Product[] = JSON.parse(data);

    // Yangilanishi kerak bo'lgan elementni topish
    const index = showcases.findIndex((item) => item.id === id);

    if (index === -1) {
      return withCORS(
        NextResponse.json(
          { message: `ID ${id} ga teng bo‘lgan showcase topilmadi` },
          { status: 404 }
        )
      );
    }

    // Mavjud elementni yangilash
    showcases[index] = {
      ...showcases[index],
      main_text: main_text ?? showcases[index].main_text,
      tag_line: tag_line ?? showcases[index].tag_line,
      image: image ?? showcases[index].image,
      price: price ?? showcases[index].price,
    };

    // Yangilangan ma'lumotni yozish
    await fs.writeFile(filePath, JSON.stringify(showcases, null, 2));

    return withCORS(
      NextResponse.json({
        message: "Showcase muvaffaqiyatli yangilandi",
        data: showcases[index],
      })
    );
  } catch (error) {
    return withCORS(
      NextResponse.json(
        { message: "Xatolik yuz berdi", error },
        { status: 500 }
      )
    );
  }
}

// 👉 OPTIONS methodni ham qo‘shish kerak
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 204 }));
}
