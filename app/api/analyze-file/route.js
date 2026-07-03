import { NextResponse } from "next/server";
import { runAI } from "@/lib/ai";
import { extractText } from "unpdf";
import mammoth from "mammoth";
import * as XLSX from "xlsx";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    const fileName = file.name.toLowerCase();

    let content = "";

    // PDF
    if (fileName.endsWith(".pdf")) {
      const result = await extractText(buffer);
      content = result.text;
    }

    // Word
    else if (
      fileName.endsWith(".docx") ||
      fileName.endsWith(".doc")
    ) {
      const data = await mammoth.extractRawText({
        buffer: Buffer.from(buffer),
      });

      content = data.value;
    }

    // Excel / CSV
    else if (
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls") ||
      fileName.endsWith(".csv")
    ) {
      const workbook = XLSX.read(Buffer.from(buffer), {
        type: "buffer",
      });

      const sheet =
        workbook.Sheets[workbook.SheetNames[0]];

      content = XLSX.utils.sheet_to_csv(sheet);
    }

    else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    const result = await runAI([
      {
        role: "system",
        content: `You are an expert document analyst.

Analyze the uploaded document professionally.

Always provide:

1. Summary
2. Key Points
3. Important Insights
4. Risks (if any)
5. Recommendations`,
      },
      {
        role: "user",
        content,
      },
    ]);

    return NextResponse.json({
      success: true,
      content,
      analysis: result.output,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}