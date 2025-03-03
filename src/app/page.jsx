"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy load components
const ProcessSection = dynamic(() => import('./components/ProcessSection'), {
  loading: () => null,
  ssr: false
});

const features = [
  {
    name: 'AI-Powered Verification',
    description: 'Advanced AI technology for medicine verification and prescription reading',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
  {
    name: 'Secure Exchange',
    description: 'End-to-end encrypted and verified medicine exchange process',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    name: 'Real-time Tracking',
    description: 'Monitor your medicine donations and requests in real-time',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    name: 'Community Support',
    description: 'Join a network of donors and recipients making healthcare accessible',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-50 to-secondary-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #40cab7 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="max-w-7xl z-20 mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <div className="relative inline-block">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block mb-2">Bridge Healthcare Gaps with</span>
                <span className="text-primary animate-float relative inline-block">
                  CareXchange
                  <div className="absolute -inset-1 bg-primary/10 blur-xl rounded-full -z-10"></div>
                </span>
              </h1>
            </div>
            <p className="mt-6 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl">
              Join our revolutionary platform for medicine donation and resale. Help redistribute surplus medications to those in need.
            </p>
            <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12 gap-6">
              <Link
                href="/donate"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl md:py-4 md:text-lg md:px-10"
              >
                <span className="absolute inset-0 w-full h-full bg-white/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-200"></span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/50 to-primary-600/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                <span className="relative flex items-center gap-2">
                  <svg className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Donate Medicine
                </span>
              </Link>
              <Link
                href="/request"
                className="mt-4 sm:mt-0 group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-xl text-secondary-700 bg-white hover:bg-gray-50 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg border border-secondary-100 md:py-4 md:text-lg md:px-10"
              >
                <span className="absolute inset-0 w-full h-full bg-secondary-100/30 rounded-xl blur-lg group-hover:blur-xl transition-all duration-200"></span>
                <span className="relative flex items-center gap-2">
                  <svg className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Request Medicine
                </span>
              </Link>
            </div>
          </div>
        </div>
        {/* Illustration 1 */}
        <div className="absolute h-full bottom-0 -right-10 hidden lg:block">
          <img src="/illustrations/hero.svg" alt="CareXchange Illustration" className="w-full h-full" />
        </div>
        {/* Illustration 2 */}
        <div className="absolute h-3/12 left-0 bottom-0">
          <img src="/illustrations/hero2.svg" alt="CareXchange Illustration" className="w-full h-full max-lg:opacity-70 max-md:opacity-40" />
        </div>
        {/* Wave Divider */}
        {/* <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div> */}
      </div>

      {/* Stats Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-primary group-hover:scale-110 transition-transform duration-200">
                <span className="inline-block animate-float">5000+</span>
              </div>
              <div className="mt-3 text-sm text-gray-600 font-medium">Medicines Donated</div>
              <div className="mt-2 w-12 h-1 bg-primary/20 mx-auto rounded-full group-hover:w-16 transition-all duration-300"></div>
            </div>
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-primary group-hover:scale-110 transition-transform duration-200">
                <span className="inline-block animate-float" style={{ animationDelay: '0.2s' }}>3000+</span>
              </div>
              <div className="mt-3 text-sm text-gray-600 font-medium">Lives Impacted</div>
              <div className="mt-2 w-12 h-1 bg-primary/20 mx-auto rounded-full group-hover:w-16 transition-all duration-300"></div>
            </div>
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-primary group-hover:scale-110 transition-transform duration-200">
                <span className="inline-block animate-float" style={{ animationDelay: '0.4s' }}>₹2M+</span>
              </div>
              <div className="mt-3 text-sm text-gray-600 font-medium">Value Redistributed</div>
              <div className="mt-2 w-12 h-1 bg-primary/20 mx-auto rounded-full group-hover:w-16 transition-all duration-300"></div>
            </div>
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-primary group-hover:scale-110 transition-transform duration-200">
                <span className="inline-block animate-float" style={{ animationDelay: '0.6s' }}>1000+</span>
              </div>
              <div className="mt-3 text-sm text-gray-600 font-medium">Active Donors</div>
              <div className="mt-2 w-12 h-1 bg-primary/20 mx-auto rounded-full group-hover:w-16 transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <ProcessSection />

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
            >
              Why Choose CareXchange?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto"
            >
              Experience a seamless and secure medicine exchange platform
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  {/* Feature Icon */}
                  <div className="absolute flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-r from-primary to-primary-600 text-white -top-7 left-8 group-hover:scale-110 transition-transform duration-200">
                    {feature.icon}
                  </div>

                  {/* Feature Content */}
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
                      {feature.name}
                    </h3>
                    <p className="mt-3 text-gray-500">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4"
            >
              What Our Community Says
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Real stories from people making a difference in healthcare accessibility
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#3caa99] transition-all duration-300 hover:translate-y-[-2px] shadow-[0_4px_6px_-1px_rgba(52,211,253,0.1),0_2px_4px_-1px_rgba(52,211,153,0.5)]"
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-[#3caa99]/10 flex items-center justify-center text-[#3caa99] text-lg font-semibold">
                  RK
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Dr. Rajesh Kumar</h3>
                  <p className="text-gray-500">Healthcare Provider</p>
                </div>
              </div>
              <p className="text-gray-600">
                "CareXchange has revolutionized how we handle surplus medicines. The platform's efficiency and security give us complete confidence in the donation process."
              </p>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#3caa99] transition-all duration-300 hover:translate-y-[-2px] shadow-[0_4px_6px_-1px_rgba(52,211,253,0.1),0_2px_4px_-1px_rgba(52,211,153,0.5)]"
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-[#3caa99]/10 flex items-center justify-center text-[#3caa99] text-lg font-semibold">
                  SP
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Sunita Patel</h3>
                  <p className="text-gray-500">Regular Donor</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Being able to help others with unused medicines instead of letting them go to waste has been incredibly fulfilling. The process is simple and secure."
              </p>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#3caa99] transition-all duration-300 hover:translate-y-[-2px] shadow-[0_4px_6px_-1px_rgba(52,211,253,0.1),0_2px_4px_-1px_rgba(52,211,153,0.5)]"
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-[#3caa99]/10 flex items-center justify-center text-[#3caa99] text-lg font-semibold">
                  AM
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Amit Mehta</h3>
                  <p className="text-gray-500">Beneficiary</p>
                </div>
              </div>
              <p className="text-gray-600">
                "CareXchange made it possible for me to access essential medications during a difficult time. The community here is truly making healthcare more accessible."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="relative bg-primary-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="relative lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block mb-1">Ready to make a difference?</span>
                <span className="block text-primary-200">Join CareXchange today.</span>
              </h2>
              <p className="mt-4 text-lg text-primary-100">
                Start your journey of compassion and help us create a world where everyone has access to essential medicines.
              </p>
              <div className="mt-10 flex gap-4">
                <Link
                  href="/register"
                  className="group relative inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-primary-600 bg-white hover:bg-primary-50 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <span className="absolute inset-0 w-full h-full bg-primary/5 rounded-xl blur-lg group-hover:blur-xl transition-all duration-200"></span>
                  <span className="relative">Get Started</span>
                </Link>
                <Link
                  href="/about"
                  className="group relative inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-medium rounded-xl text-white hover:bg-white/10 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <span className="absolute inset-0 w-full h-full bg-white/5 rounded-xl blur-lg group-hover:blur-xl transition-all duration-200"></span>
                  <span className="relative">Learn More</span>
                </Link>
              </div>
            </div>
            <div className="relative mt-10 lg:mt-0 lg:ml-8">
              <div className="relative">
                <div className="absolute -inset-4">
                  <div className="w-full h-full mx-auto opacity-30 blur-lg filter" style={{ background: 'linear-gradient(90deg, #60A5FA 0%, #34D399 100%)' }}></div>
                </div>
                <div className="relative space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white bg-opacity-10">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-white">Verified Users</p>
                      <p className="mt-2 text-base text-primary-100">All users are verified for safety and trust.</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white bg-opacity-10">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-white">Secure Platform</p>
                      <p className="mt-2 text-base text-primary-100">End-to-end encryption for all transactions.</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white bg-opacity-10">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-white">Quick Process</p>
                      <p className="mt-2 text-base text-primary-100">Fast and efficient medicine exchange.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 