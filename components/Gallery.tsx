// components/Gallery.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

interface ImageRecord {
  id: number;
  prompt: string;
  imageBase64: string;
  created_at: string;
}

interface Props {
  refreshKey: number; // change to trigger reload
}

export default function Gallery({ refreshKey }: Props) {
  const [images, setImages] = useState<ImageRecord[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await axios.get('/api/gallery');
      setImages(res.data);
    };
    fetchImages();
  }, [refreshKey]);

  if (images.length === 0) return <p>No images yet.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((img) => (
        <div key={img.id} className="border p-2 rounded">
          <img src={`data:image/png;base64,${img.imageBase64}`} alt={img.prompt} className="w-full h-auto" />
          <p className="mt-1 text-sm">{img.prompt}</p>
          <a
            href={`data:image/png;base64,${img.imageBase64}`}
            download={`generated_${img.id}.png`}
            className="text-blue-500 underline"
          >
            Download
          </a>
        </div>
      ))}
    </div>
  );
}
