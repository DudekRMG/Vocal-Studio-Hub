export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#080808]">
      <div className="text-center px-6">
        <div className="font-display text-[8rem] leading-none text-[rgba(240,238,234,0.06)] mb-6">404</div>
        <h1 className="font-display text-[2rem] tracking-[0.08em] text-[#f0eeea] mb-4">PAGE NOT FOUND</h1>
        <p className="text-[0.9rem] text-[rgba(240,238,234,0.45)]">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}
