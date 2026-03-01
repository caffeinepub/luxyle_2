import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

const COLLECTION_IMAGES = [
  { src: 'https://img.sanishtech.com/u/f56125b1f2f52137b6f021abfd8fe562.jpeg', alt: 'Luxury Interior Décor 1' },
  { src: 'https://img.sanishtech.com/u/d63b3f1566e29fe235b38438a157903f.jpeg', alt: 'Luxury Interior Décor 2' },
  { src: 'https://img.sanishtech.com/u/d4418e844613722b5c6a9ca37c49d9c4.jpeg', alt: 'Luxury Interior Décor 3' },
  { src: 'https://img.sanishtech.com/u/d7fe9528299bda266cc2b0f3ee5d5a32.jpeg', alt: 'Luxury Interior Décor 4' },
  { src: 'https://img.sanishtech.com/u/81f1aea60fd6fe9d51a12ba384647dd8.jpeg', alt: 'Luxury Interior Décor 5' },
  { src: 'https://img.sanishtech.com/u/dfcd47f133fa1694f66376e81a3788ba.jpeg', alt: 'Luxury Interior Décor 6' },
  { src: 'https://img.sanishtech.com/u/1803ea59e75d2d8b3b1baba29b3a51f5.jpeg', alt: 'Luxury Interior Décor 7' },
  { src: 'https://img.sanishtech.com/u/c240a10f7b62e426cd381343d3d3686b.jpeg', alt: 'Luxury Interior Décor 8' },
];

export default function CollectionGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="collections" className="section-padding bg-ivory">
      <div className="container-luxe">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="flex items-center justify-center gap-4">
            <div className="gold-divider w-16" />
            <span className="text-gold text-xl font-serif">✦</span>
            <div className="gold-divider w-16" />
          </div>
          <p className="font-sans-luxe text-xs tracking-[0.25em] uppercase text-gold-dark font-semibold">
            Our Curated Selection
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-royal-blue">
            The Collection
          </h2>
          <div className="gold-divider w-24 mx-auto" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {COLLECTION_IMAGES.map((img, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden cursor-pointer aspect-square bg-beige"
              onClick={() => setLightbox(idx)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-500 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                  <ZoomIn size={24} className="text-cream" />
                  <span className="font-sans-luxe text-xs tracking-widest text-cream uppercase font-semibold">
                    View
                  </span>
                </div>
              </div>
              {/* Gold border on hover */}
              <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/60 transition-all duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-cream/70 hover:text-gold transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <img
            src={COLLECTION_IMAGES[lightbox].src}
            alt={COLLECTION_IMAGES[lightbox].alt}
            className="max-w-full max-h-[85vh] object-contain shadow-luxury-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {COLLECTION_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === lightbox ? 'bg-gold w-4' : 'bg-cream/40'}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
