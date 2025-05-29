import React from 'react';
import { ArrowRight, BarChart3, Book, GraduationCap, Heart, Users } from 'lucide-react';
import Button from '../components/Button';
import NewsletterSignup from '../components/NewsletterSignup';
import TestimonialCard from '../components/TestimonialCard';
import ProgramCard from '../components/ProgramCard';

const Home: React.FC = () => {

  const iconColor = '#4DD0E1';
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-indigo-900 text-white pb-16 pt-32 md:pt-40 md:pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20" 
            // style={{ 
            //   backgroundImage: "url('https://images.pexels.com/photos/935944/pexels-photo-935944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')" 
            // }}
            style={{ 
              backgroundImage: "url('/images/home/boyslaptop.jpg')" 
            }}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Educate, Empower, Transform
            </h1> */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-blue-100">
            Educate, Empower, Transform
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            With as little as £9,99 a month, you can keep a child in school
            </p>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Join Obayi in our mission to help low-income children in Africa escape poverty through education and sustainable support programs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                variant="primary" 
                size="lg" 
                to="/donate"
              >
                Donate Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                to="/programs/scholarships"
                className="border-white text-white hover:bg-white hover:bg-opacity-10"
              >
                Adopt a star Child
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <div className="flex justify-center mb-4">
                {/* <GraduationCap className="h-12 w-12 text-orange-500" /> */}
                <GraduationCap className={`h-12 w-12 text-[#4DD0E1]`} />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">1000+</p>
              <p className="text-gray-600">Children Impacted</p>
            </div>
            <div className="p-4">
              <div className="flex justify-center mb-4">
                <Book className={`h-12 w-12 text-[${iconColor}]`} />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">5</p>
              <p className="text-gray-600">Schools Supported</p>
            </div>
            <div className="p-4">
              <div className="flex justify-center mb-4">
                <Users className={`h-12 w-12 text-[${iconColor}]`} />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">50+</p>
              <p className="text-gray-600">Active Sponsors</p>
            </div>
            <div className="p-4">
              <div className="flex justify-center mb-4">
                <BarChart3 className={`h-12 w-12 text-[${iconColor}]`} />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">98%</p>
              <p className="text-gray-600">Funds to Programs</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At Obayi, we believe that education is the most powerful tool 
                for breaking the cycle of poverty. We work to provide access to quality 
                education, resources, and support systems that empower children to 
                build a better future for themselves and their communities.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                As a UK and Nigeria registered non-profit organization, 
                Obayi is committed to raising funds to sponsor the education 
                of children across Africa. Our programs are designed to 
                support each onboarded student from enrollment through to 
                graduation with an educational diploma. We collaborate closely 
                with local educators and community leaders to ensure that our 
                initiatives are both sustainable and culturally responsive, 
                creating long-term impact for the communities we serve.
              </p>
              <Button variant="primary" to="/about">
                Learn More About Us
              </Button>
            </div>
            <div className="relative">
              <img 
                // src="https://images.pexels.com/photos/8471859/pexels-photo-8471859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                src="/images/home/mainpagepic.jpg" 
                alt="Children in school" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 flex space-x-4">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center">
                    <Heart className="h-10 w-10 text-orange-500 mr-4" />
                    <div>
                      <p className="text-lg font-bold text-gray-900">UK Registered</p>
                      <p className="text-gray-600">Company No. 15872513</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center">
                    <Heart className="h-10 w-10 text-orange-500 mr-4" />
                    <div>
                      <p className="text-lg font-bold text-gray-900">Nigeria Registered</p>
                      <p className="text-gray-600">CAC No. 8225658</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Programs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We run various educational and support programs across Africa, each designed to address specific needs and create lasting impact.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProgramCard
              title="Scholarships"
              description="Removing financial barriers with scholarships that ensure equitable access to education for students from economically disadvantaged backgrounds."
              // imageUrl="https://images.pexels.com/photos/8471744/pexels-photo-8471744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
              imageUrl="/images/home/ladykids.jpg"
              location=""
              impact="Supplied 1,000 students with materials in 2024"
            />
            <ProgramCard
              title="Support"
              description=" Equipping local educators with the tools, training, and resources needed to create engaging, effective, and inclusive learning environments for students."
              // imageUrl="https://images.pexels.com/photos/8472001/pexels-photo-8472001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
              imageUrl="/images/home/studentbags.jpg"
              location=""
              impact="Launched initial educator support in underserved communities"
            />
            <ProgramCard
              title="Structure"
              description=" Building safe, student-friendly classrooms and renovating educational facilities to foster a stable learning environment in underserved regions."
              // imageUrl="https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
               imageUrl="/images/home/smallkids.jpg"
              location=""
              impact="Enhanced public school spaces to improve students’ daily learning experience"
            />
          </div>
          <div className="text-center mt-12">
            <Button to="/programs/scholarships" variant="outline" className="inline-flex items-center">
              View All Programs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-orange-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">What People Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from our sponsors, partners, and the communities we serve about the impact of our work.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="I like that a small amount can already make a difference. It's nice to see  that kids are receiving means for education. I love the origin story of Obayi and what they set out to do."
              name="Jeannine I"
              role="Child Sponsor since 2024"
              rating={5}
            />
            <TestimonialCard
              quote="Sponsoring a child through Obayi has been one of the most fulfilling things I've done. The foundation is responsive, genuine, and truly doing meaningful work. I'm so grateful to be part of something that's making real impact and even more thankful to support a child's journey through it."
              name="Kike A"
              role="Child Sponsor since 2024"
              rating={5}
            />
            <TestimonialCard
              quote="I am passionate about helping the underprivileged and the mission of Obayi really resonated with me, as I understand the barriers  some face accessing the education that others are fortunate to receive. Donating to Obayi makes me happy to know of the positive impact I can make in a child's life."
              name="Jessica N"
              role="Monthly Donor"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white"> */}
      <section className={`py-16 bg-[#4DD0E1] text-white`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Make a Difference Today</h2>
            <p className="text-lg mb-8">
              Your support can help provide education, hope, and a pathway out of poverty for children across Africa.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                to="/donate"
                className="border-white text-white hover:bg-white hover:text-orange-500"
              >
                Donate Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                to="/programs/scholarships"
                className="border-white text-white hover:bg-white hover:text-orange-500"
              >
                Adopt a star Child
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
};

export default Home;

