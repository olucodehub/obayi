import React from 'react';
import { Building, Star, ArrowRight } from 'lucide-react';
import Button from '../../components/Button';

const Structure: React.FC = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-cyan-700 to-cyan-600 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20" 
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')" 
            }}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Building className="h-16 w-16 mx-auto mb-6 text-cyan-200" />
            <h1 className="text-4xl font-bold mb-6 text-blue-100">Infrastructure Programs</h1>
            <p className="text-xl text-cyan-100">
              Building the foundation for better education
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
                        <div className="prose prose-lg">
              <p className="text-xl text-cyan-700 mb-8 leading-relaxed">
                We rehabilitate classrooms that have fallen into disrepair — turning 
                broken spaces into safe, welcoming environments where learning can truly happen.
              </p>

                <p className="text-xl text-cyan-700 mb-8 leading-relaxed">
                    A classroom is more than four walls and a roof.
                    It’s where dreams are nurtured, questions are encouraged, and futures begin.
                </p>

                <p className="text-xl text-cyan-700 mb-8 leading-relaxed">
                    When a classroom is clean, bright, and functional, 
                    students feel valued. Teachers feel supported. 
                    And communities see education as a priority.
                </p>


              <div className="bg-cyan-50 p-8 rounded-lg mb-12">
                <p className="text-lg text-cyan-700 mb-6">

                </p>

                <div className="flex items-center">
                  <Star className="h-8 w-8 text-cyan-500 mr-4" />
                  <p className="text-lg font-semibold text-cyan-700">
                    With your support, we transform neglected learning spaces into centers of growth and possibility
                    because every child deserves a place that inspires them to learn.
                  </p>
                </div>
              </div>

              <div className="text-center mt-12">
                <h2 className="text-2xl font-bold text-cyan-700 mb-4">
                  Give support.
                </h2>
                <Button 
                  to="/donate" 
                  variant="primary"
                  size="lg"
                  className="mt-6 inline-flex items-center"
                >
                  Give Support Now
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

export default Structure;