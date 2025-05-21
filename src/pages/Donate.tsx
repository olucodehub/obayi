import React, { useState } from 'react';
import { CreditCard, Heart, BarChart3, Clock } from 'lucide-react';
import Button from '../components/Button';

const Donate: React.FC = () => {
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');

  const handlePayPalDonation = () => {
    // Open PayPal donation page in a new tab
    window.open('https://www.paypal.com/donate/?hosted_button_id=C6FJBTX4REUGG', '_blank');
  };

  const handleStripeDonation = () => {
    // Redirect to Stripe donation page
    window.open('https://donate.stripe.com/bIYg0pgJn6Cf6Aw9AB', '_blank');
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-cyan-700 to-cyan-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="h-16 w-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl font-bold mb-6">Your Support Changes Lives</h1>
            <p className="text-lg text-cyan-100 mb-0">
              Every donation helps us provide education, resources, and hope to children in need across Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Impact Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Impact of Your Donation</h2>
            <p className="text-gray-600">
              We believe in transparency and accountability. Here's how your donation makes a difference:
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-cyan-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">98%</h3>
              <p className="text-gray-600">
                of your donation goes directly to our educational programs and supporting children
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Clock className="h-12 w-12 mx-auto text-cyan-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">£10 Monthly</h3>
              <p className="text-gray-600">
                provides a child with education, school supplies, and support for an entire year
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Heart className="h-12 w-12 mx-auto text-cyan-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">100%</h3>
              <p className="text-gray-600">
                transparency with our public ledger showing how funds are used
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Options Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6 text-center">Choose Your Payment Method</h3>
              
              <div className="mb-8">
                <div className="flex flex-wrap gap-4 mb-4 justify-center">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md border ${donationType === 'one-time' ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-gray-700 border-gray-300 hover:border-cyan-600'}`}
                    onClick={() => setDonationType('one-time')}
                  >
                    One-time Donation
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md border ${donationType === 'monthly' ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-gray-700 border-gray-300 hover:border-cyan-600'}`}
                    onClick={() => setDonationType('monthly')}
                  >
                    Monthly Donation
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* PayPal Option */}
                <div className="border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
                     onClick={handlePayPalDonation}>
                  <div className="flex justify-between items-start mb-4">
                    <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" 
                         alt="PayPal" 
                         className="h-12" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Donate with PayPal</h4>
                  <p className="text-gray-600 mb-4">
                    Quick and secure payment through PayPal. Accept all major credit cards.
                  </p>
                  <Button variant="primary" onClick={handlePayPalDonation} fullWidth>
                    Donate via PayPal
                  </Button>
                </div>

                {/* Stripe Option */}
                <div className="border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
                     onClick={handleStripeDonation}>
                  <div className="flex justify-between items-start mb-4">
                    <CreditCard className="h-12 w-12 text-cyan-600" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Pay with Card</h4>
                  <p className="text-gray-600 mb-4">
                    Secure card payment powered by Stripe. All major cards accepted.
                  </p>
                  <Button variant="primary" onClick={handleStripeDonation} fullWidth>
                    Donate via Stripe
                  </Button>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 text-center">
                  Your donation is secure and encrypted. We never store your payment information.
                  Tax receipts will be emailed to you after your donation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Notice */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-cyan-50 p-6 rounded-lg border border-cyan-100">
            <h3 className="text-xl font-bold text-cyan-800 mb-4">Our Commitment to Transparency</h3>
            <p className="text-cyan-700 mb-4">
              Obayi Charity is committed to complete financial transparency. Our public ledger 
              shows all donations received and how they are allocated, while protecting donor 
              privacy when requested.
            </p>
            <p className="text-cyan-700 mb-4">
              We are a registered UK charity (No. 15872513) and comply with all relevant 
              regulations. Our financial statements are audited annually by independent auditors.
            </p>
            <p className="text-cyan-700">
              If you have any questions about our financial practices or would like more detailed 
              information, please <a href="/contact" className="text-cyan-800 underline">contact us</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;