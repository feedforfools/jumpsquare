import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Privacy Policy - Here's the Jump",
  description:
    "Privacy Policy for Here's the Jump browser extension and website. Learn what we collect, how we use it, and your choices.",
  keywords: [
    "privacy",
    "privacy policy",
    "browser extension",
    "data collection",
    "jumpscare database",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-app-surface bg-dot-pattern">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-brand-red mr-2" />
              <h1 className="text-4xl font-bold text-gray-900">
                Privacy Policy
              </h1>
            </div>
            <p className="text-lg text-app-text-secondary max-w-2xl mx-auto">
              This policy explains what the Here&apos;s the Jump! browser
              extension and website collect, how we use it, and your choices.
            </p>
            <div className="mt-4 text-sm text-app-text-secondary">
              <strong>Last Updated:</strong> October 2025
            </div>
          </div>

          <Card className="shadow-shadow bg-secondary-background">
            <CardContent className="p-8">
              <div className="prose prose-gray max-w-none">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="bg-brand-red-lighter w-8 h-8 rounded-full flex items-center justify-center text-brand-red text-sm font-bold mr-3">
                    1
                  </span>
                  Information We Collect
                </h2>

                <h3 className="text-lg font-semibold mb-3 text-gray-700">
                  1.1 Automatically Collected (Extension)
                </h3>
                <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
                  <li>
                    <strong>Instance ID:</strong> A unique identifier (UUID)
                    generated on first install to track anonymous extension
                    installations.
                  </li>
                  <li>
                    <strong>Movie Information:</strong> The movie title and year
                    of what you&apos;re watching, sent to our API to fetch
                    jumpscare data.
                  </li>
                </ul>
                <p className="text-app-text-secondary mb-6">
                  We do not collect your name, email, passwords, browsing
                  history, or page contents.
                </p>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="bg-brand-red-lighter w-8 h-8 rounded-full flex items-center justify-center text-brand-red text-sm font-bold mr-3">
                    2
                  </span>
                  How We Use This Information
                </h2>
                <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                  <li>
                    <strong>Instance ID:</strong> Used for basic analytics and
                    to prevent abuse of our API.
                  </li>
                  <li>
                    <strong>Movie Information:</strong> Used solely to retrieve
                    jumpscare data from our database.
                  </li>
                </ul>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="bg-brand-red-lighter w-8 h-8 rounded-full flex items-center justify-center text-brand-red text-sm font-bold mr-3">
                    3
                  </span>
                  Data Storage
                </h2>
                <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                  <li>
                    <strong>Instance ID (local):</strong> Stored in your
                    browser&apos;s sync storage.
                  </li>
                  <li>
                    <strong>Movie State (local):</strong> Temporarily stored in
                    session storage and cleared when the tab closes.
                  </li>
                  <li>
                    <strong>Server-side Telemetry (anonymous):</strong> Our
                    servers store the Instance ID, the movie title and year you
                    requested, request timestamps, response status codes, and an
                    aggregated query count. We do not store your IP in our
                    database. IP addresses may be processed transiently by our
                    rate limiter for abuse prevention.
                  </li>
                </ul>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="bg-brand-red-lighter w-8 h-8 rounded-full flex items-center justify-center text-brand-red text-sm font-bold mr-3">
                    4
                  </span>
                  Data Sharing
                </h2>
                <p className="text-gray-700 mb-6">
                  We do not sell, trade, or share your data with third parties.
                  We use service providers (e.g., database and rate limiting
                  infrastructure) to operate the service; they process data on
                  our behalf under strict agreements.
                </p>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="bg-brand-red-lighter w-8 h-8 rounded-full flex items-center justify-center text-brand-red text-sm font-bold mr-3">
                    5
                  </span>
                  Your Rights and Choices
                </h2>
                <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                  <li>
                    <strong>Uninstalling the extension</strong> removes all
                    extension data stored in your browser.
                  </li>
                  <li>
                    You can clear extension data via Chrome settings at any
                    time.
                  </li>
                </ul>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="bg-brand-red-lighter w-8 h-8 rounded-full flex items-center justify-center text-brand-red text-sm font-bold mr-3">
                    6
                  </span>
                  Security
                </h2>
                <p className="text-gray-700 mb-6">
                  We use industry-standard controls to protect data in transit
                  and at rest. No method of transmission or storage is 100%
                  secure, but we continually improve our safeguards.
                </p>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="bg-brand-red-lighter w-8 h-8 rounded-full flex items-center justify-center text-brand-red text-sm font-bold mr-3">
                    7
                  </span>
                  Changes
                </h2>
                <p className="text-gray-700 mb-6">
                  We may update this policy. We will update the &quot;Last
                  Updated&quot; date above when changes are made.
                </p>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="bg-brand-red-lighter w-8 h-8 rounded-full flex items-center justify-center text-brand-red text-sm font-bold mr-3">
                    8
                  </span>
                  Contact
                </h2>
                <p className="text-gray-700">
                  Questions?{" "}
                  <Link
                    href="mailto:hello@feedforfools.com"
                    className="text-brand-red hover:text-brand-red-hover underline font-semibold inline-flex items-center"
                  >
                    Contact us here
                  </Link>
                  .
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="text-center mt-8">
            <Link href="/">
              <Button variant="default">
                I Understand - Back to Here&apos;s the Jump
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
