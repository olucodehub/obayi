import React from 'react';
import { Heart, Star, ArrowRight } from 'lucide-react';
import Button from '../../components/Button';


const Support: React.FC = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-cyan-700 to-cyan-600 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20" 
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/1206101/pexels-photo-1206101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')" 
            }}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="h-16 w-16 mx-auto mb-6 text-cyan-200" />
            <h1 className="text-4xl font-bold mb-6">Give a bag outreach </h1>
            <p className="text-xl text-cyan-100">
              The Power of a School Bag
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
                        <div className="prose prose-lg">
              <p className="text-xl text-cyan-700 mb-8 leading-relaxed">
                    Every 7 weeks, we donate school bags to students who come 
                    to school without one. To many, a bag is just a container but 
                    for our students, it’s a symbol of pride, belonging, and purpose.
              </p>

                <p className="text-xl text-cyan-700 mb-8 leading-relaxed">
                    A school bag says, “I belong here.”
                    It tells the world, “I am a student.”
                    It empowers children to walk to school 
                    with dignity, confidence, and hope.
              </p>

              <div className="bg-cyan-50 p-8 rounded-lg mb-12">
                <p className="text-lg text-cyan-700 mb-6">
                    This simple but impactful gesture is more than a gift,
                    it's a psychological boost that encourages school attendance, 
                    fosters self-worth, and helps children feel seen.
                </p>

                <div className="flex items-center">
                  <Star className="h-8 w-8 text-cyan-500 mr-4" />
                  <p className="text-lg font-semibold text-cyan-700">
                    With your support, we can continue placing a symbol of possibility on the backs of students who need it most.
                  </p>
                </div>
              </div>

              <div className="text-center mt-12">
                <h2 className="text-2xl font-bold text-cyan-700 mb-4">
                  Give a bag.
                </h2>
                <Button 
                  to="/donate" 
                  variant="primary"
                  size="lg"
                  className="mt-6 inline-flex items-center"
                >
                  Give a Bag Now
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

export default Support;