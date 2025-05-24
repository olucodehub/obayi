import React from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openItem, setOpenItem] = React.useState<number | null>(null);

  const faqs = [
    {
      question: "What is the mission of the charity?",
      answer: "Our mission is to empower children in low-income communities across Africa through quality education, supportive resources, and sustainable development programs that break the cycle of poverty and create pathways to brighter futures."
    },
    {
      question: "Who benefits from the donations?",
      answer: "All donations go directly to supporting students in need, covering tuition, school supplies, uniforms, and other educational costs."
    },
    {
      question: "How can I donate to the charity?",
      answer: "You can donate through our website using PayPal or credit card (via Stripe). We accept both one-time and monthly recurring donations. All donations are secure and tax-deductible where applicable."
    },
    {
      question: "What are the criteria for sponsorship?",
      answer: "The criteria for sponsorship are listed and explained on our application page. We focus on supporting children from low-income families who show academic potential but face financial barriers to education."
    },
    {
      question: "Can I sponsor an individual student?",
      answer: "Yes, through our 'Adopt a Child' program, you can sponsor an individual student. Your monthly contribution provides them with education, school supplies, uniforms, and support. While sponsorship is anonymous to protect the child's dignity, you'll receive regular updates on their progress."
    },
    {
      question: "What percentage of my donation goes directly to the students?",
      answer: "98% of donations go directly to our educational programs and supporting children. Only 2% is used for administrative/operational costs and fundraising, ensuring your contribution has maximum impact."
    },
    {
      question: "How do you select students to support?",
      answer: "We welcome all applications and we have a committee that will select candidates on preset criteria - relative to the revenue we have collected in the last academic year. Our goal is to disburse all collected monies."
    },
    {
      question: "Can I volunteer with the charity?",
      answer: "Yes, we welcome volunteers! There are various ways you can get involved, from mentoring students to helping organize fundraising events. Contact us to learn about current opportunities and requirements."
    },
    {
      question: "How can I stay updated on the impact of my donation?",
      answer: "Regular donors receive quarterly impact reports via email. We also maintain a public ledger showing how funds are used, and our annual reports are available on our website. You can also subscribe to our newsletter for general updates."
    },
    {
      question: "Can I donate items like school supplies or uniforms?",
      answer: "While we appreciate the offer, we generally encourage monetary donations as they allow us to purchase supplies locally, supporting local economies and ensuring consistency in materials. However, for large corporate donations of supplies, please contact us to discuss possibilities."
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative bg-[#4DD0E1]  text-white py-16">  
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 text-blue-100">Frequently Asked Questions</h1>
            <p className="text-xl text-cyan-100">
              Find answers to common questions about our charity and programs
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}s
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex items-center justify-between focus:outline-none"
                    onClick={() => setOpenItem(openItem === index ? null : index)}
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {openItem === index ? (
                      <Minus className="h-5 w-5 text-cyan-600" />
                    ) : (
                      <Plus className="h-5 w-5 text-cyan-600" />
                    )}
                  </button>
                  
                  {openItem === index && (
                    <div className="px-6 py-4 bg-gray-50">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-8">
              If you couldn't find the answer you were looking for, please don't hesitate to contact us.
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="/contact" 
                className="px-6 py-3 bg-[#4DD0E1] text-white rounded-md hover:bg-cyan-700 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;