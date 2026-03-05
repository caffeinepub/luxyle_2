const FEATURED_IMAGES = [
  {
    url: "https://img.sanishtech.com/u/f56125b1f2f52137b6f021abfd8fe562.jpeg",
    label: "Living Spaces",
  },
  {
    url: "https://img.sanishtech.com/u/d63b3f1566e29fe235b38438a157903f.jpeg",
    label: "Bedroom Elegance",
  },
  {
    url: "https://img.sanishtech.com/u/d4418e844613722b5c6a9ca37c49d9c4.jpeg",
    label: "Dining Luxury",
  },
  {
    url: "https://img.sanishtech.com/u/d7fe9528299bda266cc2b0f3ee5d5a32.jpeg",
    label: "Accent Pieces",
  },
];

export default function FeaturedCollections() {
  const scrollToCollection = () => {
    document
      .getElementById("collection")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-ivory px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-body text-gold text-xs tracking-[0.3em] uppercase mb-3">
            Curated for You
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-royal-blue font-light tracking-wide mb-4">
            Featured Collection
          </h2>
          <div className="gold-divider" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_IMAGES.map((item) => (
            <button
              type="button"
              key={item.url}
              className="group relative overflow-hidden aspect-[3/4] cursor-pointer w-full"
              onClick={scrollToCollection}
              aria-label={`View ${item.label} collection`}
            >
              <img
                src={item.url}
                alt={item.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-royal-blue/0 group-hover:bg-royal-blue/40 transition-all duration-500" />
              <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div>
                  <div className="h-px w-8 bg-gold mb-2" />
                  <p className="font-heading text-ivory text-lg font-light tracking-wide">
                    {item.label}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <button
            type="button"
            onClick={scrollToCollection}
            className="font-body text-sm tracking-widest uppercase text-royal-blue border-b border-gold pb-1 hover:text-gold transition-colors"
          >
            View Full Collection →
          </button>
        </div>
      </div>
    </section>
  );
}
