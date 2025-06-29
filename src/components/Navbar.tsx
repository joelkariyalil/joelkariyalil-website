import Link from "next/link";
import { useRouter } from "next/router";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      className={`relative px-3 py-2 transition-colors duration-200 hover:text-gray-600 ${
        isActive ? "text-black font-medium" : "text-gray-500"
      }`}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-black hover:text-gray-600">
          Joel Kariyalil
        </Link>

        <div className="flex items-center gap-1 text-sm font-medium">
          <NavLink href="/">Main</NavLink>
          <NavLink href="/experience">Experience</NavLink>
          <NavLink href="/projects">Projects</NavLink>
          <NavLink href="/blog">Blogs</NavLink>
          <NavLink href="/clicks">Clicks</NavLink>
          <NavLink href="/about">About</NavLink>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 rounded-full bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
          >
            Resume
          </a>
        </div>
      </div>
    </nav>
  );
}
