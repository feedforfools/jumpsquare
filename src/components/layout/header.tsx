import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-red-600">
          Jumpsquare
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/" className="hover:text-red-600 transition-colors">
            Movies
          </Link>
          <Button variant="outline" size="sm">
            Submit Movie
          </Button>
        </nav>
      </div>
    </header>
  );
}
