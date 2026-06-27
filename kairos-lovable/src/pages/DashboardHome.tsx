export default function DashboardHome() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-kairos-muted">
        WAY Agency · Kairos
      </p>
      <h1 className="mt-4 font-display text-5xl font-light text-white">
        Sélectionnez un client
      </h1>
      <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-kairos-muted">
        Choisissez un client dans la barre latérale pour consulter son rapport,
        son trafic en direct, l'analyse de ses concurrents, ou pour discuter avec
        Kairos. Ou créez un nouveau client.
      </p>
    </div>
  );
}
