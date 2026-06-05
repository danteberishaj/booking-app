export default function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-neutral-500 sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} StayFinder — a portfolio project.</p>
        <p className="flex items-center gap-1">
          Built with Next.js, Redux Toolkit &amp; Firebase
        </p>
      </div>
    </footer>
  );
}
