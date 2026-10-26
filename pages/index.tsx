// pages/index.tsx
import { useState } from 'react';
import axios from 'axios';
import PromptEditor from '../components/PromptEditor';
import Gallery from '../components/Gallery';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [galleryRefresh, setGalleryRefresh] = useState(0);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      // Call backend generation API
      const genRes = await axios.post('/api/generate', { prompt });
      const { imageBase64 } = genRes.data;
      // Save image and metadata
      await axios.post('/api/save', {
        prompt,
        imageBase64,
      });
      setPrompt('');
      setGalleryRefresh((c) => c + 1); // trigger gallery reload
    } catch (err) {
      console.error('Generation error', err);
      alert('Failed to generate image. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">ImgEnPr0Xiii – AI Image Generator</h1>
      <PromptEditor value={prompt} onChange={setPrompt} />
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating…' : 'Generate Image'}
      </button>
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">Gallery</h2>
        <Gallery refreshKey={galleryRefresh} />
      </section>
    </main>
  );
}
