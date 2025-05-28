import React from 'react';
import { Calendar, CheckCircle, Heart, MapPin, Target, Users } from 'lucide-react';
import Button from '../components/Button';
import TestimonialCard from '../components/TestimonialCard';

const About: React.FC = () => {

  const primaryCyan = '#4DD0E1';
  const teamMembers = [
    {
      name: 'Bolarinwa Iruemiobe',
      role: 'Founder & Executive Director',
      bio: 'Leads Obayi’s mission with visionary direction, guiding its mission to empower students through education.',
      imageUrl: '/images/about/seun.jpg'   
    },
    {
      name: 'Nelson Egbunu',
      role: 'Programs Director',
      bio: 'Oversees Obayi’s programs, ensuring strategic alignment, impactful delivery, and mission-driven execution.',
      imageUrl: '/images/about/nelson.jpg'   
    },
    {
      name: 'Joy Aghogho',
      role: 'Project Coordinator',
      bio: 'Supports Obayi’s mission through hands-on project delivery and student-centered resource coordination.',
      imageUrl: '/images/about/dummyfemale.jpg'  
    },
    {
      name: 'Queen Adebisi',
      role: 'Social Media Lead',
      bio: 'Leads Obayi’s social media, sharing stories that inspire, inform, and amplify our mission.',
      imageUrl: '/images/about/dummyfemale.jpg'  
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30" 
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/935943/pexels-photo-935943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')" 
            }}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-100">
              About Obayi
            </h1>
            {/* <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-blue-100">
            About Obayi
          </h1> */}
            <p className="text-xl text-gray-300 mb-0">
              Building brighter futures through education and community support
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                  At its core, Obayi is a vibrant non-profit initiative driven by compassionate and dynamic changemakers committed to empowering children and youth in African communities through education. By unlocking access to learning, we aim to support young scholars and their families lead more fulfilling, self-sufficient lives.              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                  Obayi is a UK and Nigeria registered charitable not for profit founded by Mr. Bolarinwa O. Iruemiobe, inspired to take action against the staggering number of out-of-school children across Africa. According to UNESCO, as of November 2024, over 20% of children aged 6 to 11 in Africa are not enrolled in school. Although the challenge is vast, Obayi believes every small step matters one child at a time.              </p>
              <p className="text-gray-600 leading-relaxed">
Our flagship initiative, “Adopt a Star Child,” directly sponsors out-of-school children, covering their education from primary through tertiary levels. This is just the first step in a broader vision for sustainable change. Future phases will include advocacy for policy reform, infrastructure refurbishment, teacher empowerment, and the provision of learning resources like books and equipment. We also aim to foster behavior change communication to create long-term societal shifts.              </p>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  // src="https://images.pexels.com/photos/1206101/pexels-photo-1206101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                  src="/images/about/volunteers.jpg" 
                  alt="Children in classroom" 
                  className="rounded-lg shadow-md"
                />
                <img 
                  // src="https://images.pexels.com/photos/8471744/pexels-photo-8471744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                  src="/images/about/all.jpg" 
                  alt="School supplies" 
                  className="rounded-lg shadow-md mt-8"
                />
                <img 
                  // src="https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                  src="/images/about/clap.png" 
                  alt="Teacher with students" 
                  className="rounded-lg shadow-md"
                />
                <img 
                  // src="https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                  src="/images/about/bags.jpg"
                  alt="School building" 
                  className="rounded-lg shadow-md mt-8"
                />
              </div>
              {/* <div className="absolute -bottom-6 -right-6 bg-orange-500 p-4 rounded-lg shadow-lg"> */}
              <div className={`absolute -bottom-6 -right-6 bg-[${primaryCyan}] p-4 rounded-lg shadow-lg`}>
                <div className="text-white">
                  <p className="text-lg font-bold">Est. 2024</p>
                  <p>1 year of impact</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Mission & Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We are guided by a clear mission and a set of core values that inform everything we do.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mb-16">
            <div className="flex items-center mb-6">
              <Target className={`h-12 w-12 text-[${primaryCyan}] mr-4`} />
              <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            </div>
            <p className="text-gray-600 mb-0 text-lg leading-relaxed">
              To empower children in low-income communities across Africa through quality education, 
              supportive resources, and sustainable development programs that break the cycle of poverty 
              and create pathways to brighter futures.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
              <div className="flex items-center mb-4">
                <Heart className={`h-8 w-8 text-[${primaryCyan}] mr-3`} />
                <h3 className="text-xl font-bold text-gray-900">Compassion</h3>
              </div>
              <p className="text-gray-600">
                We approach our work with empathy, understanding, and deep respect for the communities we serve.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
              <div className="flex items-center mb-4">
                <CheckCircle className={`h-8 w-8 text-[${primaryCyan}] mr-3`} />
                <h3 className="text-xl font-bold text-gray-900">Integrity</h3>
              </div>
              <p className="text-gray-600">
                We maintain the highest standards of honesty, accountability, and transparency in all our operations.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
              <div className="flex items-center mb-4">
                <Users className={`h-8 w-8 text-[${primaryCyan}] mr-3`} />
                <h3 className="text-xl font-bold text-gray-900">Collaboration</h3>
              </div>
              <p className="text-gray-600">
                We work closely with local communities, educators, and partners to ensure sustainable impact.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
              <div className="flex items-center mb-4">
                <Calendar className={`h-8 w-8 text-[${primaryCyan}] mr-3`} />
                <h3 className="text-xl font-bold text-gray-900">Sustainability</h3>
              </div>
              <p className="text-gray-600">
                We focus on long-term solutions that empower communities to continue progress independently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated professionals behind Obayi who work tirelessly to fulfill our mission.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.imageUrl} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className={`text-[${primaryCyan}] font-medium mb-3`}>{member.role}</p> {/* Changed team role color */}
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              Our team also includes volunteers, regional coordinators, and local partners 
              who make our work possible across multiple locations.
            </p>
            <Button to="/contact" variant="outline">
              Join Our Team
            </Button>
          </div>
        </div>
      </section>

      {/* Where We Work */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Where We Work</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Obayi currently operates programs in Lagos, Nigeria, 
              with plans to expand our reach in the coming years.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
              <div className="flex items-center mb-4">
                <MapPin className={`h-6 w-6 text-[${primaryCyan}] mr-3`} />
                <h3 className="text-xl font-bold text-gray-900">Iju station primary school 1</h3>
              </div>
              <p className="text-gray-600 mb-4">
              Complementing the efforts of the Lagos State government in the development of the education sector.
              </p>
              <p className="text-sm text-gray-500">
              School Bags Support
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
              <div className="flex items-center mb-4">
                 <MapPin className={`h-6 w-6 text-[${primaryCyan}] mr-3`} />
                <h3 className="text-xl font-bold text-gray-900">Iju station primary school 2</h3>
              </div>
              <p className="text-gray-600 mb-4">
              Complementing the efforts of the Lagos State government in the development of the education sector.

              </p>
              <p className="text-sm text-gray-500">
                School Bags Support
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
              <div className="flex items-center mb-4">
                 <MapPin className={`h-6 w-6 text-[${primaryCyan}] mr-3`} />
                <h3 className="text-xl font-bold text-gray-900">Coker primary school</h3>
              </div>
              <p className="text-gray-600 mb-4">
              Complementing the efforts of the Lagos State government in the development of the education sector.

              </p>
              <p className="text-sm text-gray-500">
              School Bags Support
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
              <div className="flex items-center mb-4">
                 <MapPin className={`h-6 w-6 text-[${primaryCyan}] mr-3`} />
                <h3 className="text-xl font-bold text-gray-900">Ayanleye primary school</h3>
              </div>
              <p className="text-gray-600 mb-4">
              Complementing the efforts of the Lagos State government in the development of the education sector.
              </p>
              <p className="text-sm text-gray-500">
                50+ children supported
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg border-2 border-dashed border-[#4DD0E1]">
              <div className="flex items-center mb-4">
                 <MapPin className={`h-6 w-6 text-[${primaryCyan}] mr-3`} />
                <h3 className="text-xl font-bold text-gray-400">Khan Foundation</h3>
              </div>
              <p className="text-gray-500 mb-4">
                We're currently developing partnerships with Khan Foundation Junior Academy to expand our programs.
              </p>
              <p className="text-sm text-gray-400">
                Launched 2025 
              </p>
            </div>
            
            <div className={`bg-[${primaryCyan}] p-6 rounded-lg shadow-md`}> {/* Changed background color */}
              <div className="flex items-center mb-4">
                <Users className={`h-6 w-6 text-white mr-3`} /> {/* Text white because background is cyan */}
                <h3 className="text-xl font-bold text-gray-900">Partnership Approach</h3>
              </div>
              <p className="text-white mb-0">{/* Text white */}
                In all regions, we work through established partnerships with local schools, 
                community organizations, and education ministries to ensure our programs 
                are culturally appropriate and responsive to specific local needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={`py-16 bg-[#4DD0E1] text-white`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-lg mb-8">
              There are many ways to support Obayi's work in providing education and opportunities 
              to children across Africa. Whether through donations, volunteering, or spreading awareness, 
              your contribution makes a difference.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                to="/donate"
                className="border-white text-white hover:bg-white hover:text-[#4DD0E1]" // Changed hover text
              >
                Make a Donation
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                to="/contact"
                className="border-white text-white hover:bg-white hover:text-[#4DD0E1]" // Changed hover text
              >
                Get Involved
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Community Voices</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from the communities and partners we work with.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TestimonialCard
              quote="I support Obayi because they believe in unlocking children's education, they believe that education is the key to unlocking many opportunities in life."
              name="Joy"
              role="Child Sponsor"
            />
            <TestimonialCard
              quote="A nation that will thrive must make education it's bedrock, that is why the outstanding job Obayi is doing to assist with basic educational needs must be supported by everyone who can."
              name="Yemi"
              role="School Principal"
            />
            <TestimonialCard
              quote="Obayi....great initiative. I love what they're doing for the children. Seeing their faces light up when presented with the gifts and the hope they're being given is priceless. God bless you all."
              name="Jide"
              role="Commenter"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;