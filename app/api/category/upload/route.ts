import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const categoryPath = path.join(process.cwd(), "db", "category.db.json");
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

// POST – formData bilan category qo‘shish (title + img)
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title")?.toString() || "";
    const imageFile = formData.get("image");

    if (!title || !(imageFile instanceof File)) {
      return withCORS(
        NextResponse.json(
          { message: "title va image (file) kerak" },
          { status: 400 }
        )
      );
    }

    // uploads papkasini yaratish (agar yo‘q bo‘lsa)
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // img saqlash
    const ext = path.extname(imageFile.name);
    const fileName = `${uuidv4()}${ext}`;
    const savePath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    await fs.writeFile(savePath, buffer);

    const imagePath = `/uploads/${fileName}`;

    // category yaratish
    const newCategory = {
      id: Date.now(),
      title,
      image: imagePath,
    };

    const dbRaw = await fs.readFile(categoryPath, "utf-8");
    const categories = JSON.parse(dbRaw);
    categories.push(newCategory);
    await fs.writeFile(categoryPath, JSON.stringify(categories, null, 2));

    return withCORS(
      NextResponse.json({
        message: "Kategoriya qo‘shildi",
        data: newCategory,
      })
    );
  } catch (err) {
    return withCORS(
      NextResponse.json({ message: "Xatolik", error: err }, { status: 500 })
    );
  }
}

// OPTIONS – CORS uchun
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 204 }));
}
