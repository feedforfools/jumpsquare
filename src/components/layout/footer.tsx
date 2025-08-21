import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t mt-6 bg-red-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-black">
          <p>© 2025 Here's the Jump! All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <Link
              href="/terms"
              className="hover:text-red-600 transition-colors underline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
