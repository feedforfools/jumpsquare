import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t-3 border-black mt-6 bg-secondary-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-app-text">
          <p>© 2025 Here&apos;s the Jump! All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <Link
              href="/terms"
              className="hover:text-brand-red transition-colors underline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
