import React, { useState } from 'react';
import { Users, Heart, School, Calendar, ChevronRight, Check, Mail } from 'lucide-react';
import Button from '../components/Button';

const AdoptChild: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    sponsorshipType: 'regular',
    donationAmount: 25,
    customAmount: '',
    frequency: 'monthly',
    preferGender: 'any',
    preferAge: 'any',
    preferRegion: 'any',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    agreeTerms: false,
    agreePrivacy: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSponsorshipTypeChange = (type: string) => {
    setFormData({
      ...formData,
      sponsorshipType: type
    });
  };

  const handleDonationAmountChange = (amount: number) => {
    setFormData({
      ...formData,
      donationAmount: amount,
      customAmount: ''
    });
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setFormData({
        ...formData,
        customAmount: value,
        donationAmount: 0
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Final submission
      console.log('Form submitted:', formData);
      setStep(5); // Success page
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  const getDonationAmount = () => {
    return formData.donationAmount || (formData.customAmount ? parseFloat(formData.customAmount) : 0);
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4].map((stepNumber) => (
          <React.Fragment key={stepNumber}>
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= stepNumber 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 4 && (
              <div 
                className={`w-12 h-1 ${
                  step > stepNumber ? 'bg-orange-500' : 'bg-gray-200'
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="text-xl font-bold mb-6">Choose Your Sponsorship Type</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div 
                className={`border rounded-lg p-6 cursor-pointer transition-all ${
                  formData.sponsorshipType === 'regular' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                onClick={() => handleSponsorshipTypeChange('regular')}
              >
                <div className="flex justify-between items-start mb-4">
                  <Heart className="h-10 w-10 text-orange-500" />
                  {formData.sponsorshipType === 'regular' && (
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-500 text-white">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-semibold mb-2">Regular Sponsorship</h4>
                <p className="text-gray-600 mb-4">
                  Sponsor a specific child with monthly support for their education and well-being.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">✓</span>
                    <span>Matched with a specific child</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">✓</span>
                    <span>Regular updates on their progress</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">✓</span>
                    <span>Direct impact on one child's life</span>
                  </li>
                </ul>
              </div>
              
              <div 
                className={`border rounded-lg p-6 cursor-pointer transition-all ${
                  formData.sponsorshipType === 'group' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                onClick={() => handleSponsorshipTypeChange('group')}
              >
                <div className="flex justify-between items-start mb-4">
                  <Users className="h-10 w-10 text-orange-500" />
                  {formData.sponsorshipType === 'group' && (
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-500 text-white">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-semibold mb-2">Group Sponsorship</h4>
                <p className="text-gray-600 mb-4">
                  Support a group of children or a school class with your monthly contribution.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">✓</span>
                    <span>Support multiple children at once</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">✓</span>
                    <span>Updates on the group's progress</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-100 text-orange-600 mr-2 flex-shrink-0">✓</span>
                    <span>Broader impact on a community</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <Button onClick={nextStep} fullWidth>
              Continue
            </Button>
          </>
        );
        
      case 2:
        return (
          <>
            <h3 className="text-xl font-bold mb-6">Choose Your Sponsorship Amount</h3>
            
            <div className="mb-8">
              <div className="flex flex-wrap gap-4 mb-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md border ${formData.frequency === 'monthly' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500'}`}
                  onClick={() => setFormData({...formData, frequency: 'monthly'})}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md border ${formData.frequency === 'quarterly' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500'}`}
                  onClick={() => setFormData({...formData, frequency: 'quarterly'})}
                >
                  Quarterly
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md border ${formData.frequency === 'annually' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500'}`}
                  onClick={() => setFormData({...formData, frequency: 'annually'})}
                >
                  Annually
                </button>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="text-gray-700 font-medium mb-4">Select a sponsorship amount:</p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[25, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`py-3 rounded-md border ${
                      formData.donationAmount === amount && !formData.customAmount
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                    }`}
                    onClick={() => handleDonationAmountChange(amount)}
                  >
                    £{amount}
                  </button>
                ))}
              </div>
              
              <div className="mb-4">
                <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter a custom amount (£)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">£</span>
                  </div>
                  <input
                    type="text"
                    id="customAmount"
                    name="customAmount"
                    value={formData.customAmount}
                    onChange={handleCustomAmountChange}
                    className="block w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Recommended:</strong> £25 monthly provides a child with education, school supplies, meals, 
                  and health check-ups. Higher amounts can support additional children or provide extra resources.
                </p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={previousStep}>
                Back
              </Button>
              <Button 
                onClick={nextStep}
                disabled={(!formData.donationAmount && !formData.customAmount) || parseFloat(formData.customAmount || '0') <= 0}
              >
                Continue
              </Button>
            </div>
          </>
        );
        
      case 3:
        return (
          <>
            <h3 className="text-xl font-bold mb-6">Your Preferences</h3>
            
            <p className="text-gray-600 mb-6">
              We'll do our best to match you with {formData.sponsorshipType === 'regular' ? 'a child' : 'a group'} based on your preferences, 
              though specific matches cannot be guaranteed. All sponsorships are anonymous to the recipients.
            </p>
            
            {formData.sponsorshipType === 'regular' && (
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Gender (Optional)
                  </label>
                  <select
                    name="preferGender"
                    value={formData.preferGender}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="any">No preference</option>
                    <option value="male">Boy</option>
                    <option value="female">Girl</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Age Range (Optional)
                  </label>
                  <select
                    name="preferAge"
                    value={formData.preferAge}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="any">No preference</option>
                    <option value="4-6">4-6 years</option>
                    <option value="7-10">7-10 years</option>
                    <option value="11-14">11-14 years</option>
                    <option value="15-18">15-18 years</option>
                  </select>
                </div>
              </div>
            )}
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Region (Optional)
              </label>
              <select
                name="preferRegion"
                value={formData.preferRegion}
                onChange={handleInputChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="any">No preference</option>
                <option value="kenya">Kenya</option>
                <option value="uganda">Uganda</option>
                <option value="ghana">Ghana</option>
                <option value="tanzania">Tanzania</option>
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Select a region if you have a specific country where you'd like to focus your support.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md mb-8 border border-blue-100">
              <div className="flex">
                <Mail className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">
                    You'll receive regular updates
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    We'll send you reports on how your sponsorship is making a difference, 
                    including photos and progress updates. All communication is one-way to 
                    protect the privacy of the children.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={previousStep}>
                Back
              </Button>
              <Button onClick={nextStep}>
                Continue
              </Button>
            </div>
          </>
        );
        
      case 4:
        return (
          <>
            <h3 className="text-xl font-bold mb-6">Your Information</h3>
            
            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
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
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address*
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code*
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country*
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a country</option>
                  <option value="UK">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded mt-1"
                    required
                  />
                  <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                    I agree to the terms and conditions of the sponsorship program, including the anonymous nature of the support.
                  </label>
                </div>
                
                <div className="flex items-start">
                  <input
                    id="agreePrivacy"
                    name="agreePrivacy"
                    type="checkbox"
                    checked={formData.agreePrivacy}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded mt-1"
                    required
                  />
                  <label htmlFor="agreePrivacy" className="ml-2 block text-sm text-gray-700">
                    I agree to Obayi Charity's privacy policy and consent to receiving email updates about my sponsorship.
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-md mb-8">
              <h4 className="font-medium text-gray-900 mb-2">Your Sponsorship Summary</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{formData.sponsorshipType === 'regular' ? 'Individual Child' : 'Group'} Sponsorship</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">£{getDonationAmount()} {formData.frequency}</span>
                </li>
                {formData.preferGender !== 'any' && formData.sponsorshipType === 'regular' && (
                  <li className="flex justify-between">
                    <span className="text-gray-600">Preferred Gender:</span>
                    <span className="font-medium">{formData.preferGender === 'male' ? 'Boy' : 'Girl'}</span>
                  </li>
                )}
                {formData.preferAge !== 'any' && formData.sponsorshipType === 'regular' && (
                  <li className="flex justify-between">
                    <span className="text-gray-600">Preferred Age:</span>
                    <span className="font-medium">{formData.preferAge}</span>
                  </li>
                )}
                {formData.preferRegion !== 'any' && (
                  <li className="flex justify-between">
                    <span className="text-gray-600">Preferred Region:</span>
                    <span className="font-medium">{formData.preferRegion.charAt(0).toUpperCase() + formData.preferRegion.slice(1)}</span>
                  </li>
                )}
              </ul>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={previousStep}>
                Back
              </Button>
              <Button 
                type="submit"
                disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.city || !formData.country || !formData.postalCode || !formData.agreeTerms || !formData.agreePrivacy}
              >
                Complete Sponsorship
              </Button>
            </div>
          </>
        );
        
      case 5:
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Thank You for Your Sponsorship!</h3>
            <p className="text-gray-600 mb-6">
              Your {formData.frequency} sponsorship of £{getDonationAmount()} has been successfully set up.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h4 className="font-medium text-gray-900 mb-4">What happens next?</h4>
              <ol className="space-y-4">
                <li className="flex">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600 mr-3 flex-shrink-0">1</span>
                  <p className="text-gray-600 text-left">
                    Our team will match you with {formData.sponsorshipType === 'regular' ? 'a child' : 'a group'} based on your preferences.
                  </p>
                </li>
                <li className="flex">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600 mr-3 flex-shrink-0">2</span>
                  <p className="text-gray-600 text-left">
                    Within 7-10 days, you'll receive a welcome email with details about {formData.sponsorshipType === 'regular' ? 'your sponsored child' : 'the group you\'re supporting'}.
                  </p>
                </li>
                <li className="flex">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600 mr-3 flex-shrink-0">3</span>
                  <p className="text-gray-600 text-left">
                    Your first payment will be processed, and you'll receive a confirmation receipt.
                  </p>
                </li>
                <li className="flex">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600 mr-3 flex-shrink-0">4</span>
                  <p className="text-gray-600 text-left">
                    You'll receive regular updates about the progress and impact of your sponsorship.
                  </p>
                </li>
              </ol>
            </div>
            <div className="space-y-4">
              <Button to="/" variant="primary">
                Return to Home
              </Button>
              <div>
                <Button to="/dashboard" variant="outline">
                  View Your Dashboard
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20" 
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/935944/pexels-photo-935944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')" 
            }}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Adopt a Child</h1>
            <p className="text-xl text-blue-100 mb-0">
              Make a lasting difference in a child's life through our anonymous sponsorship program.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How Child Adoption Works</h2>
            
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/3 mb-4 md:mb-0 md:pr-8">
                  <div className="bg-blue-50 p-4 rounded-lg inline-block">
                    <Heart className="h-12 w-12 text-blue-500" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-2">Anonymous Sponsorship</h3>
                  <p className="text-gray-600">
                    Our child sponsorship program is completely anonymous. While you receive updates about your sponsored child,
                    they will not know your identity. This approach ensures dignity for the child and focuses on their needs rather than creating dependency.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/3 mb-4 md:mb-0 md:pr-8">
                  <div className="bg-orange-50 p-4 rounded-lg inline-block">
                    <School className="h-12 w-12 text-orange-500" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-2">Education & Support</h3>
                  <p className="text-gray-600">
                    Your monthly contribution provides your sponsored child with education, school supplies, 
                    uniforms, meals, and health check-ups. We focus on holistic development to help break the cycle of poverty.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/3 mb-4 md:mb-0 md:pr-8">
                  <div className="bg-green-50 p-4 rounded-lg inline-block">
                    <Calendar className="h-12 w-12 text-green-500" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-2">Regular Updates</h3>
                  <p className="text-gray-600">
                    You'll receive quarterly updates on your sponsored child's progress, including their academic achievements, 
                    activities, and photos. This allows you to see the direct impact of your support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Adoption Form */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <form onSubmit={handleSubmit}>
                {renderStepIndicator()}
                {renderStepContent()}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Sponsors Say</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <blockquote className="italic text-gray-600 mb-6">
                  "Sponsoring a child through Obayi has been one of the most rewarding experiences of my life. 
                  The regular updates about my sponsored child's progress make me feel truly connected to their journey."
                </blockquote>
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-semibold">Emma Thompson</p>
                    <p className="text-sm text-gray-500">Sponsor since 2020</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <blockquote className="italic text-gray-600 mb-6">
                  "I've been sponsoring two children for the past three years, and it's been amazing to watch 
                  their progress. The transparency of Obayi Charity gives me complete confidence that my 
                  contribution is making a real difference."
                </blockquote>
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-semibold">Michael Chen</p>
                    <p className="text-sm text-gray-500">Sponsor since 2021</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Why is the sponsorship anonymous?</h3>
                <p className="text-gray-600">
                  Anonymous sponsorship protects the dignity and privacy of both the child and the sponsor. 
                  It prevents creating dependency relationships and focuses on meeting the child's needs without 
                  expectations of gratitude or special treatment.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">How long does a sponsorship last?</h3>
                <p className="text-gray-600">
                  Sponsorships typically continue until the child completes their education, which may be through 
                  secondary school or beyond. You can cancel your sponsorship at any time, though we encourage 
                  long-term commitment for the stability of the child's education.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">What happens if I need to stop my sponsorship?</h3>
                <p className="text-gray-600">
                  We understand that circumstances change. If you need to end your sponsorship, simply contact us 
                  and we'll ensure a smooth transition. We'll work to find a new sponsor for the child to minimize 
                  any disruption to their education.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">How do I know my money is being used effectively?</h3>
                <p className="text-gray-600">
                  We provide regular updates on your sponsored child's progress and our public ledger shows all 
                  financial transactions. We also publish annual reports detailing how funds are allocated and the 
                  impact of our programs.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Can I send gifts or letters to my sponsored child?</h3>
                <p className="text-gray-600">
                  Due to the anonymous nature of our program, direct communication is not possible. However, you can 
                  make additional donations for special occasions that will benefit your sponsored child and others in 
                  their community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdoptChild;