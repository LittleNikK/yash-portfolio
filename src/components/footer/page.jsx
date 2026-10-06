import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-[#0a0c10] py-6 text-sm text-gray-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="text-xs">
          &copy; {currentYear} Yash Portfolio. All rights reserved.
        </p>

        <div className="flex items-center gap-6 text-xs">
          <Link href="https://github.com" target="_blank" rel="noreferrer" className="transition hover:text-white">
            GitHub
          </Link>
          <Link href="https://linkedin.com" target="_blank" rel="noreferrer" className="transition hover:text-white">
            LinkedIn
          </Link>
          <Link href="https://twitter.com" target="_blank" rel="noreferrer" className="transition hover:text-white">
            Twitter
          </Link>
        </div>
      </div>
    </footer>
  );
}
