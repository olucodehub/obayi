import React from 'react';
import { GraduationCap, Star, ArrowRight } from 'lucide-react';
import Button from '../../components/Button';

const Scholarships: React.FC = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-cyan-700 to-cyan-600 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20" 
            // style={{ 
            //   backgroundImage: "url('https://images.pexels.com/photos/1139319/pexels-photo-1139319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')" 
            // }}

            style={{ 
              backgroundImage: "url('/images/programs/cut.png')" 
            }}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <GraduationCap className="h-16 w-16 mx-auto mb-6 text-cyan-200" />
            <h1 className="text-4xl font-bold mb-6 text-blue-100">Adopt a Star Child</h1>
            <p className="text-xl text-cyan-100">
              Not every bright future shines on its own.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg">
              <p className="text-xl text-cyan-700 mb-8 leading-relaxed">
                Through our Adopt a Star Child program, we identify high-potential students at risk 
                of dropping out due to financial hardship — and give them the chance to thrive.
              </p>

              <div className="bg-cyan-50 p-8 rounded-lg mb-12">
                <p className="text-lg text-cyan-700 mb-6">
                  While public education is free, it doesn't always offer the quality or support 
                  every child needs. That's why we place these students in carefully selected, 
                  affordable private schools — where they receive stronger academic guidance and 
                  a better shot at success.
                </p>

                <div className="flex items-center">
                  <Star className="h-8 w-8 text-cyan-500 mr-4" />
                  <p className="text-lg font-semibold text-cyan-700">
                    Your support ensures that a promising student doesn't have to trade dreams for survival.
                  </p>
                </div>
              </div>

              <p className="text-lg text-cyan-700 mb-8">
                It provides school fees, uniforms, and the encouragement that says, 
                "You matter. Keep going."
              </p>

              <div className="text-center mt-12">
                <h2 className="text-2xl font-bold text-cyan-700 mb-4">
                  Adopt a star.<br />
                  Help them shine.
                </h2>
                <Button 
                  to="/donate" 
                  variant="primary"
                  size="lg"
                  className="mt-6 inline-flex items-center"
                >
                  Adopt a Child Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Scholarships;