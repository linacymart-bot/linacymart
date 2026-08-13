import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Linacy',
  description: 'Our privacy policy and data collection practices.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container-custom max-w-3xl mx-auto">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium text-sm mb-8 inline-block">
            &larr; Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mb-8">Last updated: August 2026</p>
          
          <div className="prose prose-slate max-w-none">
            <p>Welcome to the Linacy privacy policy. We respect your privacy and are committed to protecting your personal data.</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">1. Information We Collect</h3>
            <p>When you place an order, we collect information necessary to fulfill that order, including your name, email, phone number, and delivery address. We do not store payment details directly on our servers.</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">2. How We Use Your Information</h3>
            <p>Your information is used solely to process orders, provide customer support, and, if you opt-in, send promotional offers.</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">3. Data Security</h3>
            <p>We use industry-standard security measures (including Supabase Auth) to protect your personal information.</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">4. Contact Us</h3>
            <p>If you have any questions about this privacy policy, please contact us via WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
