import VinylShelf from "@/components/VinylShelf";
import { albums } from "@/data/albums";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5efe6] px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
            Som&apos;s Collection
          </p>
          <h1 className="mt-2 text-4xl font-bold text-neutral-900">
            Vinyl Archive
          </h1>
          <p className="mt-3 text-neutral-600">
            그녀의 lp 컬렉션을 훔쳐보자
          </p>
        </div>

        <VinylShelf albums={albums} />
      </section>
    </main>
  );
}