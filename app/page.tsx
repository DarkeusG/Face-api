import FaceLoginWidget from "@/components/FaceLogin/FaceLoginWidget";

export default function Page() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[var(--color-pokedex-red)] p-4 relative overflow-hidden">
      {/* Pokedex Hinge / Deco Background Elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-[var(--color-pokedex-dark-red)] z-0 border-b-8 border-black/20" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hinge Line */}
      <div className="absolute left-10 top-0 bottom-0 w-12 bg-[var(--color-pokedex-dark-red)] border-x-4 border-black/10 hidden md:block" />

      <FaceLoginWidget />
    </main>
  );
}
