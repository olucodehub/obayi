import React from 'react';
import { Play, ArrowRight } from 'lucide-react';

const Testimonials: React.FC = () => {
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
    },
    {
        title: "January 2025: Give a bag Outreach",
        description: "In January 2025, we visited Iju Station Primary School, Iju Lagos Nigeria.",
        longDescription: `At Iju Station Primary School, Iju Lagos, several students were without or bad school bags. 
        In January 2025, Obayi donated hundreds of school bags to ensure these children could carry their books with pride and focus on learning.`,
        impact: "Provided many students with durable school bags, helping them attend school with pride and readiness.",
        videoUrl: "https://www.youtube.com/watch?v=1qMZd8y_qM8",
        thumbnail: "/images/testimonial/kidsbag.jpg"
    },
    {
        "title": "Sponsorship of Babatunde's Education",
        "description": "Obayi sponsored Babatunde George's education after his father's passing in 2017.",
        "longDescription": "In 2017, the father of Babatunde passed away after health problems, forcing Babatunde to drop out of school. Obayi sponsored the education of Babatunde George from the last year of high school to graduation from Veritas University Abuja Nigeria. The video shows Babatunde expressing his gratitude.",
        "impact": "Enabled Babatunde to complete his education from high school through university.",
        "videoUrl": "https://www.youtube.com/watch?v=HE_AyoQs59Y",
        "thumbnail": "/images/testimonial/gbenga.png"
    },
    {
      "title": "May 2025: Childrens day Give a bag Outreach",
      "description": "On childrens day In May 27 2025, we visited kids in Makoko Lagos Nigeria.",
      "longDescription": "Obayi in collaboration with Khan Foundation made Children's day 2025 special for kids in Makoko on Tuesday May 27th. It was an opportunity to remind them they mattered and the potentials they have to offer.",
      "impact": "Provided many students with durable school bags.",
      "videoUrl": "https://www.youtube.com/watch?v=mawJp9Gt9k4",
      "thumbnail": "/images/testimonial/kidsboat.png"
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-cyan-700 to-cyan-600 text-white py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20" 
            style={{ 
              backgroundImage: "url('/images/testimonial/kidswork.jpg')"  
            }}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Success Stories</h1>
            <p className="text-xl text-cyan-100">
              Real stories of lives transformed through Obayi
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
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
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                      <Play className="h-6 w-6 text-cyan-600 ml-1" />
                    </div>
                  </a>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{testimonial.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{testimonial.description}</p>
                  
                  <div className="bg-cyan-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-cyan-700">{testimonial.impact}</p>
                  </div>
                  
                  <a 
                    href={testimonial.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                  >
                    Watch Full Story
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;