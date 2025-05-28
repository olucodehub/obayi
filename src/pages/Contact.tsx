import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Heart, MessageSquare, Clock } from 'lucide-react';
import Button from '../components/Button';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    reason: 'general'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header Section */}
      <section className="relative bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-300 mb-0">
              We'd love to hear from you. Reach out with questions, feedback, or to get involved.
            </p>
          </div>
        </div>
      </section>


      {/* Contact Information */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-500 mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">We aim to respond within 24-48 hours</p>
              <a href="mailto:info@obayicharity.org" className="text-blue-600 hover:underline">
                info@obayi.co
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and FAQ */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              
              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-4">
                      <Heart className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800">Thank You!</h3>
                  </div>
                  <p className="text-green-700 mb-4">
                    Your message has been successfully sent. We appreciate your interest and will get back to you as soon as possible.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        subject: '',
                        message: '',
                        reason: 'general'
                      });
                    }}
                    className="w-full"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name*
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                        Reason for Contact*
                      </label>
                      <select
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      >
                        <option value="general">General Inquiry</option>
                        <option value="donation">Donation Question</option>
                        <option value="sponsorship">Child Sponsorship</option>
                        <option value="volunteer">Volunteering</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="media">Media Inquiry</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject*
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message*
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center"
                    >
                      {isLoading ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
            
            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <MessageSquare className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">How can I get involved with Obayi?</h3>
                      <p className="mt-2 text-gray-600">
                        There are many ways to get involved! You can donate, sponsor a child, volunteer your time or skills,
                        become a corporate partner, or help spread awareness about our mission. Contact us with your interests
                        and we'll help find the best way for you to contribute.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <MessageSquare className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">How is my donation used?</h3>
                      <p className="mt-2 text-gray-600">
                        We allocate 93% of donations directly to our programs supporting education in Africa.
                        The remaining 7% covers essential administrative costs and fundraising efforts. You can view
                        our complete financial transparency in our public ledger section.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <MessageSquare className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Can I visit the programs I support?</h3>
                      <p className="mt-2 text-gray-600">
                        We occasionally organize trips for donors to visit our programs and see their impact firsthand.
                        These visits are carefully planned to ensure they don't disrupt education and respect the privacy
                        of the children. Contact us for information about upcoming opportunities.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <MessageSquare className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">How do you measure impact?</h3>
                      <p className="mt-2 text-gray-600">
                        We track various metrics including enrollment rates, attendance, academic performance,
                        and long-term outcomes for students. We also conduct regular program evaluations and
                        collect qualitative feedback from communities. Our annual impact reports provide
                        detailed information on these measurements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-orange-50 rounded-lg p-6 border border-orange-100">
                <div className="flex">
                  <Clock className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900">Response Time</h3>
                    <p className="text-gray-600 mt-1">
                      Our team aims to respond to all inquiries within 1-2 business days. For urgent matters,
                      please call our office directly during business hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Find Us</h2>
          
          <div className="bg-gray-200 h-96 rounded-lg overflow-hidden">
            {/* This would be replaced with an actual map component in a production environment */}
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-600">Map would be displayed here</p>
                <p className="text-gray-500 text-sm">United Kingdom</p>
              </div>
            </div>
          </div>
          
          {/* <div className="mt-6">
            <p className="text-gray-600">
              Our office is easily accessible by public transportation. The nearest tube station is Oxford Circus,
              a 5-minute walk away. Parking is limited in the area, so we recommend using public transport when possible.
            </p>
          </div> */}
        </div>
      </section>

      {/* Get Involved */}
      <section className="py-12 bg-orange-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Other Ways to Connect</h2>
            <p className="text-gray-600 mb-8">
              Follow us on social media, subscribe to our newsletter, or attend one of our events
              to stay connected with our work and community.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" to="/newsletter">
                Join Our Newsletter
              </Button>
              <Button variant="outline" to="/events">
                Upcoming Events
              </Button>
              <Button variant="outline" to="/volunteer">
                Volunteer Opportunities
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;