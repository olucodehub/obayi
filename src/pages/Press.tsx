import React from 'react';
import { Calendar, ExternalLink, FileText } from 'lucide-react';
import Button from '../components/Button';

interface PressItem {
  id: number;
  title: string;
  date: string;
  type: 'press-release' | 'news' | 'announcement';
  excerpt: string;
  content: string;
  featured?: boolean;
}

const Press: React.FC = () => {
  const pressItems: PressItem[] = [
    {
      id: 1,
      title:
        "Obayi For Education Foundation Commends FCT Minister's Intervention in Teachers' Strike, Urges Proactive Measures to Safeguard Children's Education",
      date: '2025-07-04',
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

      {/* Featured Article */}
      {pressItems.filter((item) => item.featured).length > 0 && (
        <section className='py-12 bg-white'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='max-w-4xl mx-auto'>
              <h2 className='text-2xl font-bold mb-8 text-gray-900'>
                Featured
              </h2>
              {pressItems
                .filter((item) => item.featured)
                .map((item) => (
                  <div
                    key={item.id}
                    className='bg-gray-50 rounded-lg p-8 shadow-md'
                  >
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

                    <h3 className='text-2xl font-bold mb-4 text-gray-900'>
                      {item.title}
                    </h3>
                    <p className='text-gray-600 mb-6 leading-relaxed'>
                      {item.excerpt}
                    </p>

                    <Button
                      variant='primary'
                      onClick={() => toggleExpanded(item.id)}
                    >
                      {expandedItem === item.id
                        ? 'Read Less'
                        : 'Read Full Article'}
                    </Button>

                    {expandedItem === item.id && (
                      <div className='mt-8 pt-8 border-t border-gray-200'>
                        <div className='prose prose-lg max-w-none'>
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
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* All Press Items */}
      <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-2xl font-bold mb-8 text-gray-900'>
              All Press & News
            </h2>

            <div className='space-y-6'>
              {pressItems.map((item) => (
                <div
                  key={item.id}
                  className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
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
                      {item.featured && (
                        <span className='ml-4 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded'>
                          Featured
                        </span>
                      )}
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
            <Button variant='primary' to='/newsletter'>
              Subscribe to Newsletter
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Press;
