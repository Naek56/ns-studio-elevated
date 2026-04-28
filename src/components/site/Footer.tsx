import logo from "@/assets/logo-ns-studio.png";

const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 py-12 mt-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="NS Studio" className="h-9 w-auto rounded-md" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} NS Studio. Conçu avec soin.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#services" className="hover:text-foreground transition-colors">Services</a>
            <a href="#booking" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
