import Link from 'next/link';

const Navbar: React.FC = () => (
  <nav className="w-full flex justify-end px-8 py-6 border-b border-gray-100 bg-white fixed top-0 z-20">
    <ul className="flex space-x-6 text-sm text-gray-700 font-medium tracking-wide">
      <li>
        <Link href="/" className="hover:underline underline-offset-4">Home</Link>
      </li>
      <li>
        <Link href="/blog" className="hover:underline underline-offset-4">Blog</Link>
      </li>
      <li>
        <Link href="/projects" className="hover:underline underline-offset-4">Projects</Link>
      </li>
      <li>
        <Link href="/about" className="hover:underline underline-offset-4">About</Link>
      </li>
    </ul>
  </nav>
);

export default Navbar;
