import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleQuoteCTA } from "@/lib/handleQuoteCTA";
import installProsLogo from "@/assets/installpros-logo.svg";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Industries", href: "/#industries" },
    { label: "Commercial", href: "/commercial" },
    { label: "Process", href: "/#process" },
    { label: "Residential", href: "/residential" },
    { label: "Contact", href: "/contact-us" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? "bg-background py-3"
          : "bg-background/95 backdrop-blur-md py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <img
            src={installProsLogo}
            alt="InstallPros"
            className="h-8 sm:h-10 w-auto group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-foreground hover:text-primary transition-colors font-medium"
              onClick={(e) => {
                if (link.href === "/" && location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => handleQuoteCTA("header_instant_quote", navigate)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground text-[14px] font-normal tracking-wide h-10 hover:bg-primary/90 transition-colors cursor-pointer px-5 shadow"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Instant Quote
          </button>
          <a
            href="tel:+15126756605"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D9488] text-white text-[16px] font-normal tracking-wide h-12 hover:bg-[#0B7C72] transition-colors select-all cursor-pointer px-[20px] shadow"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Sales (512) 675-6605
          </a>
        </div>

        {/* Mobile CTAs */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => handleQuoteCTA("header_mobile_quote", navigate)}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-primary text-primary-foreground text-[15px] font-normal h-11 px-5 hover:bg-primary/90 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Quote
          </button>
          <a
            href="tel:+15126756605"
            className="inline-flex items-center justify-center whitespace-nowrap gap-2 rounded-full bg-[#0D9488] text-white text-[15px] font-normal h-11 px-5 hover:bg-[#0B7C72] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <Phone className="w-4 h-4 flex-shrink-0" />
            Call
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
