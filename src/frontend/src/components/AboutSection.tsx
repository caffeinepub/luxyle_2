export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-beige">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full border border-gold opacity-30" />
            <img
              src="/assets/generated/luxyle-about.dim_800x600.png"
              alt="About Luxyle"
              className="w-full h-auto object-cover relative z-10 shadow-luxury-lg"
            />
            {/* Gold accent corner */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-gold" />
          </div>

          {/* Content */}
          <div>
            <p className="font-body text-gold text-xs tracking-[0.3em] uppercase mb-4">
              Our Story
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-royal-blue font-light tracking-wide mb-6">
              About Luxyle
            </h2>
            <div className="gold-divider-left mb-8" />

            <p className="font-body text-charcoal/80 text-lg leading-relaxed mb-8">
              At Luxyle, we curate refined interior décor pieces that transform
              ordinary spaces into luxurious experiences. Every element is
              selected with attention to detail, elegance, and timeless design.
            </p>

            {/* Brand Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
              {[
                {
                  title: "Premium Quality",
                  desc: "Only the finest materials and craftsmanship",
                },
                {
                  title: "Exclusive Curation",
                  desc: "Handpicked pieces for discerning tastes",
                },
                {
                  title: "Personal Service",
                  desc: "Tailored guidance for your unique space",
                },
              ].map((pillar) => (
                <div key={pillar.title} className="border-t border-gold pt-4">
                  <h4 className="font-heading text-royal-blue text-lg font-medium mb-2">
                    {pillar.title}
                  </h4>
                  <p className="font-body text-sm text-charcoal/60 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
