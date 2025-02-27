"use client";

import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">About</span>
              <span className="block text-primary">CareXchange</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              A revolutionary platform bridging healthcare gaps through compassionate medicine donation and redistribution.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Our Mission</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Making Healthcare Accessible
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We're on a mission to reduce medicine waste and ensure everyone has access to the medications they need.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative group">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-primary to-primary-600 text-white group-hover:scale-110 transition-transform duration-200">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">
                      Social Impact
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Creating positive social change by facilitating medicine redistribution and reducing healthcare costs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-primary to-primary-600 text-white group-hover:scale-110 transition-transform duration-200">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">
                      Safety First
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Ensuring medicine safety through AI-powered verification and expert pharmacist review.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-primary to-primary-600 text-white group-hover:scale-110 transition-transform duration-200">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">
                      Community Driven
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Building a compassionate community of donors and recipients working together.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-primary to-primary-600 text-white group-hover:scale-110 transition-transform duration-200">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">
                      Innovation
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Leveraging AI and technology to make medicine donation safe and efficient.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Our Technology</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Advanced Features for Safety
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative bg-white p-6 rounded-2xl shadow-md group hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-primary to-primary-600 text-white group-hover:scale-110 transition-transform duration-200">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center pt-8">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">AI Image Recognition</h3>
                  <p className="mt-4 text-base text-gray-500">
                    Automatically extracts medicine details from images using advanced AI technology.
                  </p>
                </div>
              </div>

              <div className="relative bg-white p-6 rounded-2xl shadow-md group hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-primary to-primary-600 text-white group-hover:scale-110 transition-transform duration-200">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center pt-8">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">Prescription Reader</h3>
                  <p className="mt-4 text-base text-gray-500">
                    Smart prescription reading for both handwritten and printed prescriptions.
                  </p>
                </div>
              </div>

              <div className="relative bg-white p-6 rounded-2xl shadow-md group hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-primary to-primary-600 text-white group-hover:scale-110 transition-transform duration-200">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                </div>
                <div className="text-center pt-8">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">Medicine Recommender</h3>
                  <p className="mt-4 text-base text-gray-500">
                    Smart recommendations for cost-effective generic alternatives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Want to make a difference?</span>
            <span className="block text-primary">Start donating or requesting medicines today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 gap-4">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/donate"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-600 transition-colors duration-200"
              >
                Donate Medicine
              </Link>
            </div>
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/request"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 border-primary transition-colors duration-200"
              >
                Request Medicine
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 