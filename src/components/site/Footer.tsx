export default function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="container-tight flex flex-col items-center justify-between gap-4 py-10 sm:flex-row">
        <a href="/" className="flex items-center gap-2 font-display text-base font-extrabold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />
          Kairos
        </a>
        <p className="text-sm text-muted-foreground">La veille qui travaille pour vous.</p>
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Kairos</p>
      </div>
    </footer>
  );
}
