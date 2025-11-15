import React from 'react';
import { Calendar, ExternalLink, FileText, Video } from 'lucide-react';
import Button from '../components/Button';
import usePageTitle from '../hooks/usePageTitle';

interface PressItem {
  id: number;
  title: string;
  date: string;
  type: 'press-release' | 'news' | 'announcement';
  excerpt: string;
  content: string;
  youtubeUrl?: string;
}

const Press: React.FC = () => {
  usePageTitle('Press & News');

  // Helper function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    try {
      const urlObj = new URL(url);

      // Check if it's a youtu.be short link
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      }

      // Check if it's a standard youtube.com link
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      }

      return null;
    } catch (e) {
      // Fallback to regex if URL parsing fails
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[7].length === 11) ? match[7] : null;
    }
  };

  const pressItems: PressItem[] = [
    {
      id: 4,
      title: "Obayi for Education Outreach — The Quantanamu IDP Camp, Girei, Adamawa State",
      date: '2024-11-04',
      type: 'news',
      excerpt:
        'On Tuesday, November 4, Obayi for Education visited the Quantanamu IDP Camp in Girei, Adamawa State, to donate books and shoes to the students in the camp.',
      content: `On Tuesday, November 4, Obayi for Education visited the Quantanamu IDP Camp in Girei, Adamawa State, to donate books and shoes to the students in the camp. The camp is run by the inspiring Tent to School Initiative, and we are proud to be associated with the incredible work they are doing to ensure that displaced children have access to education.

The Tent to School Initiative has been instrumental in providing educational opportunities to children who have been displaced due to conflict and insecurity. Through their dedication and commitment, they have created a safe and nurturing environment where these children can learn and grow.

During our visit, we distributed books and shoes to the students, recognizing that access to educational materials and basic necessities are fundamental to their learning experience. We were deeply moved by the resilience and enthusiasm of these young learners, who continue to pursue their education despite the challenges they face.

Obayi for Education remains committed to supporting initiatives that provide educational opportunities to marginalized and displaced children. We believe that every child deserves access to quality education, regardless of their circumstances, and we are honored to work alongside organizations like the Tent to School Initiative in making this vision a reality.`,
      youtubeUrl: 'https://www.youtube.com/watch?v=3Ki-CKzFRIM',
    },
    {
      id: 3,
      title: "World Teachers' Day Celebration",
      date: '2024-10-05',
      type: 'news',
      excerpt:
        'On this World Teachers\' Day, Obayi for Education, in association with the Alumni of Solid Foundation International School, proudly honors and celebrates Dr. Dideoolu Adekogbe for her outstanding dedication, mentorship, and lifelong commitment to education.',
      content: `On this World Teachers' Day, Obayi for Education, in association with the Alumni of Solid Foundation International School, proudly honors and celebrates Dr. Dideoolu Adekogbe for her outstanding dedication, mentorship, and lifelong commitment to education.

Dr. Adekogbe has been a beacon of inspiration for countless students, shaping minds and transforming lives through her unwavering passion for teaching. Her contributions to education extend far beyond the classroom, embodying the true spirit of mentorship and educational excellence.

We are grateful for her years of service and dedication to nurturing the next generation of leaders, thinkers, and changemakers.`,
      youtubeUrl: 'https://www.youtube.com/watch?v=KJFeA3GcKBQ&feature=youtu.be',
    },
    {
      id: 2,
      title: 'Obayi for Education Foundation at the Lagos Maiden Build a Dream Student Conference',
      date: '2024-09-24',
      type: 'news',
      excerpt:
        'We were delighted to participate in the first-ever Build a Dream Student Conference in Lagos, held in collaboration with the Women in Science and Engineering Foundation and the Build a Dream Foundation.',
      content: `We were delighted to participate in the first-ever Build a Dream Student Conference in Lagos, held in collaboration with the Women in Science and Engineering Foundation and the Build a Dream Foundation.

At Obayi for Education Foundation, we believe in creating opportunities for students to thrive, and this event was a powerful step in inspiring young female students to pursue careers in STEM.

The conference brought together students, educators, and industry professionals to discuss the importance of STEM education and the opportunities it creates. Through workshops, panel discussions, and interactive sessions, young women were encouraged to explore their potential in science, technology, engineering, and mathematics.

We are proud to be part of this journey of empowering the next generation of innovators, leaders, and problem-solvers. Together, we are building dreams and creating pathways for success in STEM fields.`,
      youtubeUrl: 'https://www.youtube.com/watch?v=Gc4hju5nhSE',
    },
    {
      id: 1,
      title:
        "Obayi For Education Foundation Commends FCT Minister's Intervention in Teachers' Strike, Urges Proactive Measures to Safeguard Children's Education",
      date: '2024-07-04',
      type: 'press-release',
      excerpt:
        "The Foundation acknowledges Minister Nyesom Wike's intervention in the four-month teachers' strike while expressing concern over the prolonged disruption to children's education.",
      content: `The Obayi For Education Foundation today issued a statement acknowledging the recent intervention by the Federal Capital Territory (FCT) Minister, Nyesom Wike, in the protracted strike by primary school teachers across the FCT Area Councils. While welcoming this crucial step towards resolving the industrial action, the Foundation expressed profound concern over the four-month duration of the strike and its severe impact on the educational future of thousands of Abuja's children.

For over 100 days, public primary schools in the FCT have remained closed, leaving countless children, particularly those from low-income families, without access to basic education. This prolonged disruption, stemming from the non-implementation of the N70,000 national minimum wage, along with other allowances and arrears owed to teachers by the Area Councils, has jeopardized academic progress, disrupted second-term examinations, and led to the complete loss of the third-term academic period. The ripple effect has extended beyond education, crippling primary healthcare services in the territory as well.

The Obayi For Education Foundation commends Minister Wike for taking decisive action, including meetings with the Nigeria Union of Teachers (NUT) and Area Council Chairmen, and the bold resolution to utilize 10% of the Area Councils' Internally Generated Revenue (IGR) to settle 70% of the outstanding teachers' entitlements. This intervention is a testament to the recognition of the critical state of primary education in the FCT.

However, it is with a heavy heart that we reflect on the avoidable suffering endured by our children. The Foundation firmly believes that such a crucial intervention should have been initiated much earlier. A more proactive approach by all stakeholders could have averted the extended period of school closures, mitigating the significant learning loss and psychological impact on the pupils. The fundamental right to education for every child should never be compromised due to administrative impasses.

The Obayi For Education Foundation stands ready to collaborate with the FCT Administration, Area Councils, and all educational stakeholders to develop and implement sustainable solutions that prevent future disruptions to the academic calendar. We urge continuous dialogue, transparency, and a steadfast commitment to prioritizing the welfare of our educators and, most importantly, the uninterrupted learning of our children.

The future of the FCT, and indeed Nigeria, rests on the foundation of a well-educated populace. We must collectively ensure that no child is left behind due to preventable circumstances.`,
      featured: true,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'press-release':
        return 'bg-blue-100 text-blue-800';
      case 'news':
        return 'bg-green-100 text-green-800';
      case 'announcement':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'press-release':
        return 'Press Release';
      case 'news':
        return 'News';
      case 'announcement':
        return 'Announcement';
      default:
        return 'Update';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const [expandedItem, setExpandedItem] = React.useState<number | null>(null);

  const toggleExpanded = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <div className='min-h-screen pt-20'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-r from-cyan-700 to-cyan-600 text-white py-16'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl mx-auto text-center'>
            <FileText className='h-16 w-16 mx-auto mb-6 text-cyan-200' />
            <h1 className='text-4xl font-bold mb-6'>Press & News</h1>
            <p className='text-xl text-cyan-100'>
              Stay updated with the latest news, press releases, and
              announcements from Obayi For Education Foundation
            </p>
          </div>
        </div>
      </section>

      {/* All Press Items */}
      <section className='py-12 bg-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto'>

            <div className='space-y-6'>
              {pressItems.map((item) => (
                <div
                  key={item.id}
                  className='bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
                >
                  <div className='p-6'>
                    <div className='flex items-center mb-4'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          item.type
                        )}`}
                      >
                        {getTypeLabel(item.type)}
                      </span>
                      <div className='flex items-center ml-4 text-gray-500'>
                        <Calendar className='h-4 w-4 mr-2' />
                        <span className='text-sm'>{formatDate(item.date)}</span>
                      </div>
                    </div>

                    <h3 className='text-xl font-bold mb-3 text-gray-900'>
                      {item.title}
                    </h3>
                    <p className='text-gray-600 mb-4 leading-relaxed'>
                      {item.excerpt}
                    </p>

                    <div className='flex items-center justify-between'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => toggleExpanded(item.id)}
                      >
                        {expandedItem === item.id ? 'Read Less' : 'Read More'}
                      </Button>

                      <button className='flex items-center text-cyan-600 hover:text-cyan-700 text-sm'>
                        <ExternalLink className='h-4 w-4 mr-1' />
                        Share
                      </button>
                    </div>

                    {expandedItem === item.id && (
                      <div className='mt-6 pt-6 border-t border-gray-200'>
                        <div className='prose max-w-none'>
                          {item.content
                            .split('\n\n')
                            .map((paragraph, index) => (
                              <p
                                key={index}
                                className='text-gray-700 mb-4 leading-relaxed'
                              >
                                {paragraph}
                              </p>
                            ))}
                        </div>

                        {/* YouTube Video Embed */}
                        {item.youtubeUrl && (
                          <div className='mt-6'>
                            <div className='flex items-center mb-4'>
                              <Video className='h-5 w-5 mr-2 text-cyan-600' />
                              <h4 className='text-lg font-semibold text-gray-900'>Watch Video</h4>
                            </div>
                            <div className='relative w-full' style={{ paddingBottom: '56.25%' }}>
                              <iframe
                                className='absolute top-0 left-0 w-full h-full rounded-lg shadow-lg'
                                src={`https://www.youtube.com/embed/${getYouTubeVideoId(item.youtubeUrl)}?feature=oembed`}
                                title={item.title}
                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                                referrerPolicy='strict-origin-when-cross-origin'
                                allowFullScreen
                              ></iframe>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className='py-12 bg-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl mx-auto bg-cyan-50 p-8 rounded-lg border border-cyan-100'>
            <h3 className='text-2xl font-bold text-cyan-800 mb-4'>
              Media Contact
            </h3>
            <p className='text-cyan-700 mb-4'>
              For media inquiries, press releases, or interview requests, please
              contact our communications team.
            </p>
            <div className='space-y-2'>
              <p className='text-cyan-700'>
                <strong>Email:</strong>{' '}
                <a
                  href='mailto:info@obayi.co'
                  className='text-cyan-800 hover:underline'
                >
                  info@obayi.co
                </a>
              </p>
              <p className='text-cyan-700'>
                <strong>Response Time:</strong> We aim to respond to all media
                inquiries within 24 hours.
              </p>
            </div>
            <div className='mt-6'>
              <Button variant='primary' to='/contact'>
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl mx-auto text-center'>
            <h3 className='text-2xl font-bold mb-4 text-gray-900'>
              Stay Informed
            </h3>
            <p className='text-gray-600 mb-8'>
              Subscribe to our newsletter to receive the latest news and updates
              from Obayi For Education Foundation.
            </p>
            <Button
              variant='primary'
              onClick={() =>
                window.open('https://tinyurl.com/jrhc7wk4', '_blank')
              }
            >
              Subscribe to Newsletter
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Press;
