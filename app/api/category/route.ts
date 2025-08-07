import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const categoryPath = path.join(process.cwd(), "db", "category.db.json");
const productPath = path.join(process.cwd(), "db", "products.db.json");
const uploadDir = path.join(process.cwd(), "public", "uploads");

function withCORS(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

// ✅ GET – barcha category yoki ma'lum bir category bo'yicha productlar
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryTitle = searchParams.get("title");
    console.log(categoryTitle);
    
  try {
    if (categoryTitle) {
      const productRaw = await fs.readFile(productPath, "utf-8");
      const products = JSON.parse(productRaw);

      const filtered = products.filter(
        (product: any) => product.category?.toLowerCase() === categoryTitle.toLowerCase()
      );

      return withCORS(NextResponse.json({ data: filtered }));
    } else {
      const categoryRaw = await fs.readFile(categoryPath, "utf-8");
      const categories = JSON.parse(categoryRaw);
      return withCORS(NextResponse.json({ data: categories }));
    }
  } catch (err) {
    return withCORS(
      NextResponse.json({ message: "Xatolik", error: err }, { status: 500 })
    );
  }
}


export async function PUT(req: Request) {
  try {
    const formData = await req.formData();

    const id = parseInt(formData.get("id")?.toString() || "0");
    const title = formData.get("title")?.toString() || "";
    const imgFile = formData.get("image"); // optional

    if (!id) {
      return withCORS(
        NextResponse.json({ message: "id kerak" }, { status: 400 })
      );
    }

    // uploads papkasini tekshir
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const dbRaw = await fs.readFile(categoryPath, "utf-8");
    const parsed = JSON.parse(dbRaw);

    const index = parsed.findIndex((cat: any) => cat.id === id);
    if (index === -1) {
      return withCORS(
        NextResponse.json({ message: "Category topilmadi" }, { status: 404 })
      );
    }

    let imagePath = parsed[index].image; // eski rasm

    // Agar yangi img kelgan bo‘lsa, saqlaymiz
    if (imgFile instanceof File) {
      const ext = path.extname(imgFile.name);
      const fileName = `${uuidv4()}${ext}`;
      const savePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await imgFile.arrayBuffer());
      await fs.writeFile(savePath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    // Yangilash
    parsed[index] = {
      ...parsed[index],
      title: title || parsed[index].title,
      image: imagePath,
    };


    await fs.writeFile(categoryPath, JSON.stringify(parsed, null, 2));

    return withCORS(
      NextResponse.json({
        message: "Kategoriya yangilandi",
        data: parsed[index],
      })
    );
  } catch (err) {
    return withCORS(
      NextResponse.json({ message: "Xatolik", error: err }, { status: 500 })
    );
  }
}


// ✅ DELETE – id orqali o‘chirish
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id") || "0");

  if (!id) {
    return withCORS(
      NextResponse.json({ message: "id kerak" }, { status: 400 })
    );
  }

  try {
    const db = await fs.readFile(categoryPath, "utf-8");
    let parsed = JSON.parse(db);

    const findData = parsed.find((el:any) => el.id == id)
    if(!findData){
         return withCORS(NextResponse.json({ message:`${id} - category mavjud emas` }));
    }

    const filtered = parsed.filter((cat: any) => cat.id !== id);

    await fs.writeFile(categoryPath, JSON.stringify(filtered, null, 2));

    return withCORS(NextResponse.json({ message: `${id} - category o'chirildi` }));
  } catch (err) {
    return withCORS(
      NextResponse.json({ message: "Xatolik", error: err }, { status: 500 })
    );
  }
}

// ✅ OPTIONS
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 204 }));
}
