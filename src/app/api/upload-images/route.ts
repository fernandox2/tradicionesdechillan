
import { saveImage } from '@/actions/imagenes/upload-images';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file || typeof file === 'string') {
      return new Response(JSON.stringify({ message: 'No image file uploaded' }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imageUrl = await saveImage(buffer, (file as File).name);

    return new Response(JSON.stringify({ imageUrl }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error uploading image' }), { status: 500 });
  }
}
