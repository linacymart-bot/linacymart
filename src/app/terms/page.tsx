import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - Linacy',
  description: 'Terms of service and conditions of use.',
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container-custom max-w-3xl mx-auto">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium text-sm mb-8 inline-block">
            &larr; Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>
          <p className="text-sm text-slate-500 mb-8">Last updated: August 2026</p>
          
          <div className="prose prose-slate max-w-none">
            <p>Welcome to Linacy. By accessing or using our website, you agree to be bound by these terms of service.</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">1. Use of the Site</h3>
            <p>You may use our site for lawful purposes only. You must not use our site in any way that causes, or may cause, damage to the site or impairment of the availability or accessibility of the site.</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">2. Products and Pricing</h3>
            <p>All products are subject to availability. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">3. Returns and Refunds</h3>
            <p>Please contact our support agents via WhatsApp for any return or refund inquiries within 7 days of receiving your order.</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">4. Governing Law</h3>
            <p>These terms and conditions are governed by and construed in accordance with the laws of Kenya.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
