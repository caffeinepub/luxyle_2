export default function AboutSection() {
  return (
    <section id="about" className="section-padding bg-beige">
      <div className="container-luxe">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Ornament */}
          <div className="flex items-center justify-center gap-4">
            <div className="gold-divider w-16" />
            <span className="text-gold text-xl font-serif">✦</span>
            <div className="gold-divider w-16" />
          </div>

          <p className="font-sans-luxe text-xs tracking-[0.25em] uppercase text-gold-dark font-semibold">
            Our Story
          </p>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-royal-blue leading-tight">
            About Luxyle
          </h2>

          <div className="gold-divider w-24 mx-auto" />

          <p className="font-sans-luxe text-base md:text-lg leading-relaxed text-foreground/70 font-medium max-w-2xl mx-auto">
            At Luxyle, we curate refined interior décor pieces that transform ordinary spaces into
            luxurious experiences. Every element is selected with attention to detail, elegance,
            and timeless design.
          </p>

          {/* Three pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-gold/20">
            {[
              { title: 'Curated Excellence', desc: 'Every piece is hand-selected for its quality and aesthetic refinement.' },
              { title: 'Timeless Design', desc: 'We believe in décor that transcends trends and stands the test of time.' },
              { title: 'Personal Touch', desc: 'Our team works closely with you to bring your vision to life.' },
            ].map((pillar) => (
              <div key={pillar.title} className="space-y-3 text-center">
                <div className="w-8 h-px bg-gold mx-auto" />
                <h3 className="font-serif text-xl font-semibold text-royal-blue">{pillar.title}</h3>
                <p className="font-sans-luxe text-sm text-foreground/60 leading-relaxed font-medium">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
