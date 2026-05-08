import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Use ImgBB API for production-ready uploads
    const apiKey = process.env.IMGBB_API_KEY;
    
    if (!apiKey) {
      console.error("IMGBB_API_KEY is missing");
      return NextResponse.json({ error: "Upload service not configured" }, { status: 500 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    const imgbbFormData = new FormData();
    imgbbFormData.append("image", base64Image);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: imgbbFormData,
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error?.message || "ImgBB upload failed");
    }

    return NextResponse.json({ 
      url: data.data.url, 
      publicId: data.data.id 
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ success: true });
}
