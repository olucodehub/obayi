import React, { useState } from 'react';
import { CreditCard, Heart, BarChart3, Clock, Building } from 'lucide-react';
import Button from '../components/Button'; // Assuming Button component is correctly imported

// Bank details for copying to clipboard
const bankDetails = `Bank: Providus Bank
Account Name: Obayi For Education Foundation
Account Number: 1306973690`;

// Stripe link for one-time donations
const oneTimeStripeLink = 'https://donate.stripe.com/bIYg0pgJn6Cf6Aw9AB';

// Stripe link for monthly donations - IMPORTANT: Replace this with your actual monthly Stripe link
const monthlyStripeLink = 'https://donate.stripe.com/4gMcN5ebA0Yt1ad2ep4F202'; 

const Donate: React.FC = () => {
  // State to manage whether the donation type is one-time or monthly
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');

  // Function to handle PayPal donations
  const handlePayPalDonation = () => {
    window.open('https://www.paypal.com/donate/?hosted_button_id=C6FJBTX4REUGG', '_blank');
  };

  // Function to handle Stripe donations for one-time payments
  const handleStripeDonation = () => {
    window.open(oneTimeStripeLink, '_blank');
  };

  // Function to handle Stripe donations for monthly payments
  const handleMonthlyStripeDonation = () => {
    window.open(monthlyStripeLink, '_blank');
  };

  // Function to copy bank account details to the clipboard
  const handleCopyAccountDetails = async () => {
    try {
      // Attempt to write the bankDetails string to the clipboard
      await navigator.clipboard.writeText(bankDetails);
      // Provide user feedback on successful copy
      alert('Account details copied to clipboard!'); 
    } catch (err) {
      // Log and alert if copying fails
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text.');
    }
  };

  // Array of predefined donation options
  const donationOptions = [
    {
      title: "Primary School Support",
      amount: 6,
      period: "monthly",
      description: "Covers basic education needs including books and supplies",
      link: "https://donate.stripe.com/eVqeVd8RgbD71ad4mx4F203"
    },
    {
      title: "Secondary School Support",
      amount: 10,
      period: "monthly",
      description: "Provides comprehensive secondary education support",
      link: "https://donate.stripe.com/cNidR9ebA6iN5qt3it4F204"
    },
    {
      title: "University School Support",
      amount: 37,
      period: "monthly",
      description: "Helps with university tuition and materials",
      link: "https://donate.stripe.com/00waEX3wW6iNaKN1al4F205"
    },
    {
      title: "School Bag Support",
      amount: 2,
      period: "one-time",
      description: "Provides one school bag to a student",
      link: "https://donate.stripe.com/bIYg0pgJn6Cf6Aw9AB"
    },
    {
      title: "School Uniform",
      amount: 5,
      period: "one-time",
      description: "Provides a complete school uniform",
      link: "https://donate.stripe.com/bIYg0pgJn6Cf6Aw9AB"
    },
    {
      title: "Refurbishments",
      amount: null, // Null indicates no specific amount, contact for details
      period: "one-time",
      description: "Support classroom renovation projects - Contact us for details",
      link: "/contact",
      isInternal: true
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section: Displays a welcoming message and an icon */}
      <section className="relative bg-gradient-to-r from-cyan-700 to-cyan-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="h-16 w-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl font-bold mb-6 text-blue-100">Your Support Changes Lives</h1>
            <p className="text-lg text-cyan-100 mb-0">
              Every donation helps us provide education, resources, and hope to children in need across Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Options Section: Lists various ways to donate with descriptions and amounts */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Ways You Can Help</h2>
            <div className="grid md:grid-cols-3 gap-6">
            {donationOptions.map((option, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-lg p-6 text-center cursor-pointer hover:shadow-lg transition-all"
                onClick={() => {
                  if (option.isInternal) {
                    window.location.href = option.link;
                  } else {
                    window.open(option.link, '_blank');
                  }
                }}
              >
                <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                {option.amount ? (
                  <p className="text-2xl font-bold text-cyan-600 mb-2">
                    £{option.amount}
                    <span className="text-sm text-gray-600">/{option.period === 'monthly' ? 'mo' : 'once'}</span>
                  </p>
                ) : (
                  <p className="text-lg font-medium text-cyan-600 mb-2">Contact Us</p>
                )}
                <p className="text-gray-600 text-sm">{option.description}</p>
              </div>
            ))}

              {/* {donationOptions.map((option, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                  {option.amount ? (
                    <p className="text-2xl font-bold text-cyan-600 mb-2">
                      £{option.amount}
                      <span className="text-sm text-gray-600">/{option.period === 'monthly' ? 'mo' : 'once'}</span>
                    </p>
                  ) : (
                    <p className="text-lg font-medium text-cyan-600 mb-2">Contact Us</p>
                  )}
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </section>

      {/* Donation Impact Section: Highlights the impact of donations with statistics and icons */}
      <section className="py-12 bg-gray-50">
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
                of your donation goes directly to our educational programs supporting children
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

      {/* Payment Options Section: Allows users to choose between one-time and monthly payments via different platforms */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6 text-center">Choose Your Payment Method</h3>

              {/* Donation Type Selector (One-time vs. Monthly) */}
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

              {/* Payment Method Cards (PayPal, Stripe, Bank Transfer) */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* PayPal Option Card */}
                <div className="border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer flex flex-col h-full">
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                           alt="PayPal"
                           className="h-12" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Donate with PayPal</h4>
                    <p className="text-gray-600 mb-4">
                      Quick and secure payment through PayPal. Accept all major credit cards.
                    </p>
                  </div>
                  <Button variant="primary" onClick={handlePayPalDonation} fullWidth className="mt-auto">
                    Donate via PayPal
                  </Button>
                </div>

                {/* Stripe Option Card: Dynamically changes link based on donationType */}
                <div className="border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer flex flex-col h-full">
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <CreditCard className="h-12 w-12 text-cyan-600" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Pay with Card</h4>
                    <p className="text-gray-600 mb-4">
                      Secure card payment powered by Stripe. All major cards accepted.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    // Conditional onClick: uses monthlyStripeLink if donationType is 'monthly', otherwise oneTimeStripeLink
                    onClick={donationType === 'monthly' ? handleMonthlyStripeDonation : handleStripeDonation}
                    fullWidth
                    className="mt-auto"
                  >
                    Donate via Stripe
                  </Button>
                </div>

                {/* Nigerian Bank Transfer Option Card */}
                <div className="border rounded-lg p-6 hover:shadow-lg transition-all flex flex-col h-full">
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <Building className="h-12 w-12 text-cyan-600" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Nigerian Bank Transfer</h4>
                    <div className="text-gray-600 mb-4">
                      <p className="mb-2">Bank: Providus Bank</p>
                      <p className="mb-2">Account Name: Obayi For Education Foundation</p>
                      <p className="mb-2">Account Number: 1306973690</p>
                    </div>
                  </div>
                  <Button variant="primary" onClick={handleCopyAccountDetails} fullWidth className="mt-auto">
                    Copy Account Details
                  </Button>
                </div>
              </div>

              {/* Security and Tax Information */}
              <div className="mt-8 bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 text-center">
                  Your donation is secure and encrypted. We never store your payment information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Notice Section: Details the organization's commitment to financial transparency */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-cyan-50 p-6 rounded-lg border border-cyan-100">
            <h3 className="text-xl font-bold text-cyan-800 mb-4">Our Commitment to Transparency</h3>
            <p className="text-cyan-700 mb-4">
              Obayi is committed to complete financial transparency. Our public ledger
              shows all donations received and how they are allocated, while protecting donor
              privacy when requested.
            </p>
            <p className="text-cyan-700 mb-4">
              We are a registered and comply with all relevant
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
