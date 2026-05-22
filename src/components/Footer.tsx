import { Link } from "react-router-dom";
import installProsLogoWhite from "@/assets/installpros-logo-white.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-bg pt-6 pb-4 px-4 md:py-10 md:px-6 my-0">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-6">
          <img
            src={installProsLogoWhite}
            alt="InstallPros"
            className="h-10 w-auto" />
          
          <nav className="flex items-center gap-6">
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Terms & Conditions
            </Link>
            <Link to="/contact-us" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Contact Us
            </Link>
          </nav>
        </div>

        <div className="border-t border-muted-foreground/20 pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-muted-foreground/80 text-xs">
            © {currentYear} InstallPros. All Rights Reserved.
          </p>
          <p className="text-muted-foreground/60 text-xs">
            Nationwide Satellite Internet & Smart Home Installations
          </p>
        </div>
        <p className="text-muted-foreground/60 text-[11px] leading-relaxed mt-4 text-center md:text-left max-w-3xl">
          InstallPros is an independent installation company and is not affiliated with or endorsed by Starlink or SpaceX.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
