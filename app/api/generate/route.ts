import QRCode from "qrcode";
import JSZip from "jszip";
import { writeFile, readFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const { stringsArray, opts } = await req.json();

  // Validate that body contains array of strings
  if (!Array.isArray(stringsArray) || stringsArray.length === 0) {
    return new Response("Invalid input: Provide an array of strings", {
      status: 400,
    });
  }

  const zip = new JSZip();
  // Generate QR codes and add to ZIP file
  for (let i = 0; i < stringsArray.length; i++) {
    const fileName = `qrcode-${i}.svg`; // Name for the QR code file

    // Generate QR code file
    await QRCode.toFile(
      path.join(process.cwd(), "public", fileName),
      stringsArray[i],
      { ...opts, type: "svg" },
    );
    zip.file(
      fileName,
      await readFile(path.join(process.cwd(), "public", fileName)),
    ); // Read the file and add to zip
  }

  // Generate the ZIP file buffer
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  // Create a ZIP file in the `public` folder (or other directory)
  const zipFilePath = path.join(process.cwd(), "public", "qrcodes.zip");
  await writeFile(zipFilePath, zipBuffer);

  // Respond with the URL to download the ZIP file
  return Response.json({ downloadUrl: "/qrcodes.zip" });
}
