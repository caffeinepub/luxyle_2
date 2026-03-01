import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const COLLECTION_IMAGES = [
  { url: 'https://img.sanishtech.com/u/f56125b1f2f52137b6f021abfd8fe562.jpeg', label: 'Living Spaces' },
  { url: 'https://img.sanishtech.com/u/d63b3f1566e29fe235b38438a157903f.jpeg', label: 'Bedroom Elegance' },
  { url: 'https://img.sanishtech.com/u/d4418e844613722b5c6a9ca37c49d9c4.jpeg', label: 'Dining Luxury' },
  { url: 'https://img.sanishtech.com/u/d7fe9528299bda266cc2b0f3ee5d5a32.jpeg', label: 'Accent Pieces' },
  { url: 'https://img.sanishtech.com/u/81f1aea60fd6fe9d51a12ba384647dd8.jpeg', label: 'Lounge Design' },
  { url: 'https://img.sanishtech.com/u/dfcd47f133fa1694f66376e81a3788ba.jpeg', label: 'Artisan Crafts' },
  { url: 'https://img.sanishtech.com/u/1803ea59e75d2d8b3b1baba29b3a51f5.jpeg', label: 'Statement Décor' },
  { url: 'https://img.sanishtech.com/u/c240a10f7b62e426cd381343d3d3686b.jpeg', label: 'Luxury Details' },
];

export default function CollectionGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + COLLECTION_IMAGES.length) % COLLECTION_IMAGES.length);
  };

  const next = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % COLLECTION_IMAGES.length);
  };

  return (
    <section id="collection" className="py-24 bg-ivory px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-body text-gold text-xs tracking-[0.3em] uppercase mb-3">
            Explore Our World
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-royal-blue font-light tracking-wide mb-4">
            The Collection
          </h2>
          <div className="gold-divider" />
          <p className="font-body text-charcoal/60 mt-6 max-w-xl mx-auto text-sm leading-relaxed">
            Each piece in our collection is thoughtfully selected to bring elegance and sophistication
            to your living spaces.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {COLLECTION_IMAGES.map((item, i) => (
            <div
              key={i}
              className="group relative overflow-hidden aspect-square cursor-pointer"
              onClick={() => openLightbox(i)}
            >
              <img
                src={item.url}
                alt={item.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gold overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-royal-blue/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/60 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <div className="h-px w-8 bg-gold mb-2" />
                <p className="font-heading text-ivory text-base font-light tracking-wide">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-ivory/70 hover:text-gold transition-colors z-10"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 md:left-8 text-ivory/70 hover:text-gold transition-colors z-10 p-2"
            aria-label="Previous"
          >
            <ChevronLeft size={36} />
          </button>

          <div
            className="max-w-4xl max-h-[85vh] mx-16 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={COLLECTION_IMAGES[lightboxIndex].url}
              alt={COLLECTION_IMAGES[lightboxIndex].label}
              className="max-w-full max-h-[80vh] object-contain shadow-luxury-lg"
            />
            <div className="text-center mt-4">
              <div className="gold-divider" />
              <p className="font-heading text-ivory text-xl font-light tracking-widest mt-2">
                {COLLECTION_IMAGES[lightboxIndex].label}
              </p>
              <p className="font-body text-ivory/40 text-xs mt-1">
                {lightboxIndex + 1} / {COLLECTION_IMAGES.length}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 md:right-8 text-ivory/70 hover:text-gold transition-colors z-10 p-2"
            aria-label="Next"
          >
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </section>
  );
}
