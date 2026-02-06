import FaceLoginWidget from "@/components/FaceLogin/FaceLoginWidget";

export default function Page() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[var(--color-pokedex-red)] p-4 relative overflow-hidden box-shadow-inset">
      {/* Background Pattern (Dot Grid) */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.3)_100%)]" />

      {/* Pokedex Hinge / Deco Background Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-[var(--color-pokedex-dark-red)] z-0 border-b-[8px] border-black/20 shadow-xl" />

      {/* Hinge Line */}
      <div className="absolute left-4 md:left-10 top-0 bottom-0 w-8 md:w-16 bg-[var(--color-pokedex-dark-red)] border-x-[6px] border-black/10 shadow-inner hidden md:block z-0" />

      <FaceLoginWidget />
    </main>
  );
}
