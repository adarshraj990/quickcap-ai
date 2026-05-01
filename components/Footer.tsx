import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/40 backdrop-blur-md mt-auto py-8">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase flex items-center justify-center gap-2">
            QuickCap AI <span className="w-1 h-1 rounded-full bg-slate-600" /> Private by Design
          </p>
          
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-400">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
