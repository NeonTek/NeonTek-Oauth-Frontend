// app/components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Geist } from 'next/font/google';

// You can add your social media links here
const socialLinks = [
  // { name: 'Facebook', href: '#', icon: '/facebook.svg' },
  // { name: 'Twitter', href: '#', icon: '/twitter.svg' },
  // { name: 'LinkedIn', href: '#', icon: '/linkedin.svg' },
];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:order-2">
            {socialLinks.map((item) => (
              <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">{item.name}</span>
                {/* <Image src={item.icon} alt={item.name} width={24} height={24} /> */}
              </a>
            ))}
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; {new Date().getFullYear()} NeonTek. All rights reserved.
            </p>
          </div>
        </div>
         <nav className="mt-8 flex flex-wrap justify-center -mx-5 -my-2" aria-label="Footer">
           <div className="px-5 py-2">
              <Link href="/dashboard" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">
                Dashboard
              </Link>
            </div>
            <div className="px-5 py-2">
              <a href="https://neontek.co.ke/about" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">
                About
              </a>
            </div>
             <div className="px-5 py-2">
              <a href="https://neontek.co.ke/contact" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">
                Contact
              </a>
            </div>
             <div className="px-5 py-2">
              <a href="https://neontek.co.ke/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900 dark:hover:text-white">
                Privacy Policy
              </a>
            </div>
        </nav>
      </div>
    </footer>
  );
}