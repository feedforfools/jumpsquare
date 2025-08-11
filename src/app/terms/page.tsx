import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Jumpsquare",
  description:
    "Terms of Service for Jumpsquare. Learn about prohibited uses, data scraping restrictions, and intellectual property rights for our jumpscare database.",
  keywords: [
    "terms of service",
    "legal",
    "data protection",
    "scraping prohibited",
    "jumpscare database",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, AlertTriangle, Scale, Database } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-red-50 to-white">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Scale className="h-8 w-8 text-red-600 mr-2" />
              <h1 className="text-4xl font-bold text-gray-900">
                Terms of Service
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using Jumpsquare. By
              accessing our website, you agree to be bound by these terms.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              <strong>Last Updated:</strong> August 2025
            </div>
          </div>

          {/* Quick Notice Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-red-800 text-sm">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  No Scraping
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-red-700">
                  Automated data collection, scraping, or harvesting is strictly
                  prohibited.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-blue-800 text-sm">
                  <Database className="h-4 w-4 mr-2" />
                  Database Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-blue-700">
                  Our compiled database is protected intellectual property.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-green-800 text-sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Personal Use
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-green-700">
                  Content is provided for personal, non-commercial use only.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Terms Content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="prose prose-gray max-w-none">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center text-red-600 text-sm font-bold mr-3">
                    1
                  </span>
                  Acceptance of Terms
                </h2>
                <p className="mb-6 text-gray-700 leading-relaxed">
                  By accessing, browsing, or using Jumpsquare (&quot;the
                  Service&quot;), you acknowledge that you have read,
                  understood, and agree to be bound by these Terms of Service
                  and our Privacy Policy. If you do not agree to these terms,
                  you must not use our Service.
                </p>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center text-red-600 text-sm font-bold mr-3">
                    2
                  </span>
                  Intellectual Property and Database Rights
                </h2>

                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  2.1 Database Compilation Rights
                </h3>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  While individual factual information about movies may not be
                  copyrightable, our{" "}
                  <strong>
                    compilation, organization, categorization, timing precision,
                    intensity ratings, and presentation
                  </strong>{" "}
                  of jumpscare data represents substantial intellectual effort
                  and constitutes protected intellectual property under database
                  rights and compilation copyright laws.
                </p>

                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  2.2 Proprietary Elements
                </h3>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  The following elements are our exclusive intellectual
                  property:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                  <li>Precise timestamp measurements and formatting system</li>
                  <li>Intensity rating methodology and scale (1-10)</li>
                  <li>Categorization system (major, minor, false alarm)</li>
                  <li>Database structure, organization, and relationships</li>
                  <li>Website design, layout, and user interface</li>
                  <li>Descriptive text and commentary</li>
                  <li>Selection criteria and editorial decisions</li>
                </ul>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center text-red-600 text-sm font-bold mr-3">
                    3
                  </span>
                  Prohibited Uses
                </h2>

                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  3.1 Automated Data Collection
                </h3>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  You are <strong>strictly prohibited</strong> from:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                  <li>
                    Using bots, scrapers, crawlers, or automated tools to access
                    our content
                  </li>
                  <li>
                    Systematically downloading, copying, or extracting our
                    database
                  </li>
                  <li>
                    Using APIs, scripts, or programs to bulk collect our data
                  </li>
                  <li>
                    Circumventing technical measures designed to prevent
                    automated access
                  </li>
                  <li>
                    Creating derivative databases using our compiled information
                  </li>
                </ul>

                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  3.2 Commercial Use Restrictions
                </h3>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  Our content may not be used for:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                  <li>Creating competing websites or applications</li>
                  <li>Selling, licensing, or redistributing our data</li>
                  <li>Training AI models or machine learning systems</li>
                  <li>Building commercial products or services</li>
                  <li>Research purposes without explicit written permission</li>
                </ul>

                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  3.3 Technical Restrictions
                </h3>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  You must not:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                  <li>
                    Make excessive requests that could harm our infrastructure
                  </li>
                  <li>Attempt to reverse engineer our systems or APIs</li>
                  <li>Bypass rate limiting or security measures</li>
                  <li>Use our service in ways that violate applicable laws</li>
                </ul>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center text-red-600 text-sm font-bold mr-3">
                    4
                  </span>
                  Permitted Uses
                </h2>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  You may use our Service for:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
                  <li>Personal, non-commercial viewing and reference</li>
                  <li>
                    Sharing individual movie pages via social media (with
                    attribution)
                  </li>
                  <li>
                    Brief quotations in reviews or articles (with proper
                    attribution)
                  </li>
                  <li>Educational use in classroom settings (limited scope)</li>
                </ul>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center text-red-600 text-sm font-bold mr-3">
                    5
                  </span>
                  Enforcement and Legal Remedies
                </h2>

                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  5.1 Violation Detection
                </h3>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  We actively monitor for unauthorized use through technical
                  measures, legal notices, and community reporting. Violations
                  may result in:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                  <li>Immediate termination of access</li>
                  <li>Legal action for damages and injunctive relief</li>
                  <li>Reporting to relevant authorities</li>
                  <li>Claims for attorney fees and costs</li>
                </ul>

                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  5.2 DMCA and Legal Process
                </h3>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  We will pursue all available legal remedies for violations,
                  including but not limited to copyright infringement claims,
                  breach of contract actions, and computer fraud and abuse
                  claims where applicable.
                </p>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center text-red-600 text-sm font-bold mr-3">
                    6
                  </span>
                  Disclaimer and Limitations
                </h2>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  Our jumpscare data is provided for entertainment purposes.
                  Timestamps may vary by version, cut, or release format. We
                  make no warranties about accuracy, completeness, or
                  suitability for any particular purpose.
                </p>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center text-red-600 text-sm font-bold mr-3">
                    7
                  </span>
                  Modifications and Governing Law
                </h2>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  We reserve the right to modify these terms at any time.
                  Continued use constitutes acceptance of modified terms. These
                  terms are governed by applicable copyright and database
                  protection laws.
                </p>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center text-red-600 text-sm font-bold mr-3">
                    8
                  </span>
                  Contact Information
                </h2>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  For questions about these terms, licensing inquiries, or to
                  report violations, please{" "}
                  <Link
                    href="/contact"
                    className="text-red-600 hover:text-red-700 underline font-semibold"
                  >
                    contact us here
                  </Link>
                  .
                </p>
                <p className="text-gray-700 leading-relaxed">
                  For academic research or legitimate commercial licensing, we
                  may consider special arrangements on a case-by-case basis.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="text-center">
            <Link href="/">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                I Understand - Back to Jumpsquare
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
