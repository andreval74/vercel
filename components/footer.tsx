
"use client";

import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xs">SC</span>
            </div>
            <span className="font-bold text-lg text-white">SCCafé CREATE2</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/create" className="hover:text-white transition-colors">
              Create Token
            </Link>
            <span>© 2025 SCCafé. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
