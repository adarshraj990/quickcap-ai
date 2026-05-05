import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#080A11] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
              <span className="text-white text-xs">✨</span>
            </div>
            <span className="text-xl font-black text-white tracking-tighter">QuickCap AI</span>
          </div>
          
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </nav>

          <p className="text-slate-500 text-xs font-medium">
            © 2026 QuickCap AI
          </p>
        </div>
      </div>
    </footer>
  );
}
