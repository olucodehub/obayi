import React from 'react';
import { GraduationCap, Star, ArrowRight, Play } from 'lucide-react';
import Button from '../../components/Button';

const Scholarships: React.FC = () => {
  const testimonials = [
    {
      title: "A Ray of Hope for the Clements Family",
      description: "Victoria and Emanuel: A Future Reclaimed Through Education",
      longDescription: `The Clements, a family of five who live in the city of Lagos, 
      Nigeria, have faced a relentless storm of hardship. Job loss, homelessness – 
      these are the cruel blows that life has dealt with them, threatening to drown 
      their dreams. Yet, amidst all these,  they still desire to provide their 
      children with the best possible education. The crushing weight of poverty 
      has proven too heavy, forcing these precious children to endure the 
      soul-crushing heartbreak of repeated school dropouts.
      We cannot stand and watch while these young minds are robbed of their chance to soar.`,
      impact: "In January 2025 Victoria and Emanuel were awarded a scholarship to keep them in school until they graduate.",
      videoUrl: "https://www.youtube.com/watch?v=IqBwgL0ZBnc",
      thumbnail: "/images/programs/winners.png"
    },
    {
      title: "Empowering the Onyejesi Girls Through Education",
      description: "Through the compassion of our donor community, a resilient single mother in Lagos is now able to send her daughters back to school.",
      longDescription: `A brave mother left an abusive past behind to protect her daughters. Now, with Obayi’s support, Zoë and Ada are building a brighter future through education.`,
      impact: "Providing stability and opportunity by fully funding Zoë and Ada’s education through community support.",
      videoUrl: "https://youtu.be/bm9YWePIzjg",
      thumbnail: "/images/programs/onyejesi.png"
    },
    {
      title: "March 2025: Bags of Dignity for Coker Students",
      description: "Local teachers share how the scholarship program has transformed their students' lives and their community.",
      longDescription: `At Coker Primary School in Ogba, Lagos, some students came to class with tattered bags—or none at all. 
      In March 2025, Obayi donated 100 school bags to ensure these children could carry their books with pride and focus on learning.`,
      impact: "Provided 100 students with durable school bags, helping them attend school with pride and readiness.",
      videoUrl: "https://www.youtube.com/watch?v=IWrXDrgEIfA&t=48s",
      thumbnail: "/images/about/bags.jpg"
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-cyan-700 to-cyan-600 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20" 
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
              Creating Lasting Impact, One child, One life, One future at a time.
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

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Testimonials</h2>
            
            <div className="space-y-12">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative">
                      <img 
                        src={testimonial.thumbnail} 
                        alt={testimonial.title}
                        className="w-full h-full object-cover"
                      />
                      <a 
                        href={testimonial.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-50 transition-all"
                      >
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                          <Play className="h-8 w-8 text-cyan-600 ml-1" />
                        </div>
                      </a>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">{testimonial.title}</h3>
                      <div className="prose prose-lg">
                        <p className="text-gray-600 mb-4">{testimonial.longDescription}</p>
                        <div className="bg-cyan-50 p-4 rounded-lg mt-4">
                          <h4 className="font-semibold text-cyan-800 mb-2">Impact</h4>
                          <p className="text-cyan-700">{testimonial.impact}</p>
                        </div>
                        <a 
                          href={testimonial.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-6 text-cyan-600 hover:text-cyan-700"
                        >
                          Watch Full Story
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Scholarships;