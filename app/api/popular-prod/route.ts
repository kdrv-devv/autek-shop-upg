import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// JSON DB fayl manzili
const popularProdPath = path.join(
  process.cwd(),
  "db",
  "popularproduct.db.json"
);
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

// Get all
export async function GET() {
  try {
    const data = await fs.readFile(popularProdPath, "utf-8");
    const parsed = JSON.parse(data);

    if (!parsed) {
      NextResponse.json(
        { message: "Popular products xozircha bo'sh " },
        { status: 500 }
      );
    }

    return withCORS(NextResponse.json({ data: parsed }));
  } catch (err) {
    return withCORS(
      NextResponse.json({ message: "Xatolik", error: err }, { status: 500 })
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const price = parseFloat(formData.get("price")?.toString() || "0");
    const rate = parseFloat(formData.get("rate")?.toString() || "0");
    const discount = parseFloat(formData.get("discount")?.toString() || "0");
    const imageFile = formData.get("image");

    if (!title || !imageFile || !(imageFile instanceof File)) {
      return withCORS(
        NextResponse.json(
          { message: "title va image (file) majburiy" },
          { status: 400 }
        )
      );
    }

    // uploads papkasini tekshir yoki yarat
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const ext = path.extname(imageFile.name);
    const fileName = `${uuidv4()}${ext}`;
    const savePath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    await fs.writeFile(savePath, buffer);

    const imagePath = `/uploads/${fileName}`;

    const newProduct = {
      id: Date.now(),
      title,
      description,
      price,
      rate,
      discount,
      image: imagePath,
    };

    const dbRaw = await fs.readFile(popularProdPath, "utf-8");
    const parsed = JSON.parse(dbRaw);
    parsed.push(newProduct);
    await fs.writeFile(popularProdPath, JSON.stringify(parsed, null, 2));

    return withCORS(
      NextResponse.json({
        message: "Popular product qo‘shildi",
        data: newProduct,
      })
    );
  } catch (err) {
    return withCORS(
      NextResponse.json({ message: "Xatolik", error: err }, { status: 500 })
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "");

    if (!id) {
      return withCORS(
        NextResponse.json({ message: "ID topilmadi" }, { status: 400 })
      );
    }

    const dbRaw = await fs.readFile(popularProdPath, "utf-8");
    const parsed = JSON.parse(dbRaw);

    const productIndex = parsed.findIndex((item: any) => item.id == id);
    if (productIndex === -1) {
      return withCORS(
        NextResponse.json({ message: "Product topilmadi" }, { status: 404 })
      );
    }

    const [deletedProduct] = parsed.splice(productIndex, 1);

    // Rasmni fayldan o‘chiramiz
    const imgPath = path.join(process.cwd(), "public", deletedProduct.image);
    try {
      await fs.unlink(imgPath);
    } catch (err) {
      console.warn("Rasm topilmadi yoki o‘chirilmadi:", err);
    }

    await fs.writeFile(popularProdPath, JSON.stringify(parsed, null, 2));

    return withCORS(NextResponse.json({ message: "Product o‘chirildi", id }));
  } catch (err) {
    return withCORS(
      NextResponse.json({ message: "Xatolik", error: err }, { status: 500 })
    );
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();

    const id = parseInt(formData.get("id")?.toString() || "");
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const price = parseFloat(formData.get("price")?.toString() || "0");
    const rate = parseFloat(formData.get("rate")?.toString() || "0");
    const discount = parseFloat(formData.get("discount")?.toString() || "0");
    const imageFile = formData.get("image");

    if (!id || !title) {
      return withCORS(
        NextResponse.json({ message: "ID va title majburiy" }, { status: 400 })
      );
    }

    const dbRaw = await fs.readFile(popularProdPath, "utf-8");
    const parsed = JSON.parse(dbRaw);

    const productIndex = parsed.findIndex((item: any) => item.id === id);
    if (productIndex === -1) {
      return withCORS(
        NextResponse.json({ message: "Product topilmadi" }, { status: 404 })
      );
    }

    let imagePath = parsed[productIndex].image;

    // Agar yangi rasm bo‘lsa
    if (imageFile && imageFile instanceof File) {
      const ext = path.extname(imageFile.name);
      const fileName = `${uuidv4()}${ext}`;
      const savePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      await fs.writeFile(savePath, buffer);

      // Eski rasmni o‘chirish
      const oldImgPath = path.join(
        process.cwd(),
        "public",
        parsed[productIndex].image
      );
      try {
        await fs.unlink(oldImgPath);
      } catch (err) {
        console.warn("Eski rasm o‘chirilmadi yoki topilmadi:", err);
      }

      imagePath = `/uploads/${fileName}`;
    }

    // Yangilangan product
    const updatedProduct = {
      ...parsed[productIndex],
      title,
      description,
      price,
      rate,
      discount,
      image: imagePath,
    };

    parsed[productIndex] = updatedProduct;

    await fs.writeFile(popularProdPath, JSON.stringify(parsed, null, 2));

    return withCORS(
      NextResponse.json({
        message: "Product yangilandi",
        data: updatedProduct,
      })
    );
  } catch (err) {
    return withCORS(
      NextResponse.json({ message: "Xatolik", error: err }, { status: 500 })
    );
  }
}

export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 204 }));
}
