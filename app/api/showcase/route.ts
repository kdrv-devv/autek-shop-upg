import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { existsSync } from "fs";


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



const popularProdPath = path.join(process.cwd(), "db", "showcase.db.json");
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

export async function GET() {
  try {
    const data = await fs.readFile(popularProdPath, "utf-8");
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
    const formData = await req.formData();

    const id = parseInt(formData.get("id")?.toString() || "");
    const main_text = formData.get("main_text")?.toString() || "";
    const tag_line = formData.get("tag_line")?.toString() || "";
    const uzum_link = formData.get("uzum_link")?.toString() || "";
    const current = parseInt(formData.get("current")?.toString() || "0");
    const old = parseInt(formData.get("old")?.toString() || "0");
    const discount = parseFloat(formData.get("discount")?.toString() || "0");
    const imageFile = formData.get("image");

    if (!id || !main_text || !tag_line) {
      return withCORS(
        NextResponse.json({ message: "ID, main_text va tag_line majburiy" }, { status: 400 })
      );
    }

    // showcase.json o‘qib olish
    const data = await fs.readFile(popularProdPath, "utf-8");
    const showcases = JSON.parse(data);

    const productIndex = showcases.findIndex((item: any) => item.id === id);
    if (productIndex === -1) {
      return withCORS(
        NextResponse.json({ message: "Showcase topilmadi" }, { status: 404 })
      );
    }

    // Rasm yuklash
    let imagePath = showcases[productIndex].image;

    if (imageFile && imageFile instanceof File) {
      const ext = path.extname(imageFile.name);
      const fileName = `${uuidv4()}${ext}`;
      const savePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      await fs.writeFile(savePath, buffer);

      // eski rasmni o‘chirishga urinish
      try {
        const oldImagePath = path.join(process.cwd(), "public", showcases[productIndex].image);
        if (existsSync(oldImagePath)) {
          await fs.unlink(oldImagePath);
        }
      } catch (err) {
        console.warn("Eski rasm topilmadi yoki o‘chirib bo‘lmadi:", err);
      }

      imagePath = `/uploads/${fileName}`;
    }

    // Yangilangan obyekt
    const updatedProduct = {
      ...showcases[productIndex],
      main_text,
      tag_line,
      image: imagePath,
      uzum_link,
      price: {
        current,
        old,
        discount,
      },
    };

    // arrayni yangilaymiz
    showcases[productIndex] = updatedProduct;

    await fs.writeFile(popularProdPath, JSON.stringify(showcases, null, 2));

    return withCORS(
      NextResponse.json({
        message: "Showcase muvaffaqiyatli yangilandi",
        data: updatedProduct,
      })
    );
  } catch (err) {
    return withCORS(
      NextResponse.json({ message: "Server xatosi", error: err }, { status: 500 })
    );
  }
}

// 👉 OPTIONS methodni ham qo‘shish kerak
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 204 }));
}
