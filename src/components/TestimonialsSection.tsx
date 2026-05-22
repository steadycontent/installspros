import { useEffect, useRef } from "react";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const script = document.createElement("script");
    script.src = "https://cdn.trustindex.io/loader.js?05d872c66879717c7f0684e9d64";
    script.defer = true;
    script.async = true;
    containerRef.current.appendChild(script);

    // Strip clickable anchors inside the Trustindex widget (header "based on X reviews", Google logo, etc.)
    const stripLinks = () => {
      if (!containerRef.current) return;
      const anchors = containerRef.current.querySelectorAll("a");
      anchors.forEach((a) => {
        a.removeAttribute("href");
        a.removeAttribute("target");
        a.style.pointerEvents = "none";
        a.style.cursor = "default";
        a.style.textDecoration = "none";
        a.style.color = "inherit";
      });
    };
    const interval = window.setInterval(stripLinks, 500);
    const stopTimeout = window.setTimeout(() => window.clearInterval(interval), 15000);

    return () => {
      script.remove();
      window.clearInterval(interval);
      window.clearTimeout(stopTimeout);
    };
  }, []);

  return (
    <section className="section section-muted">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Top-Rated by Our Clients
          </h2>
        </div>
        <div ref={containerRef} />
      </div>
    </section>
  );
};

export default TestimonialsSection;
