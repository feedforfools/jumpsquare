import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ComingSoon } from "@/components/ui/coming-soon";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-red-600">
          Jumpsquare
        </Link>
        <nav className="flex items-center space-x-4">
          <ComingSoon
            position="top-right"
            badgeColor="bg-gradient-to-r from-red-500 to-orange-500"
          >
            <Button variant="outline" size="sm">
              Submit Movie
            </Button>
          </ComingSoon>
        </nav>
      </div>
    </header>
  );
}
