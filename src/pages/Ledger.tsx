import React, { useState } from 'react';
import { Search, Calendar, Filter, ChevronDown, ChevronUp, Download } from 'lucide-react';
import Button from '../components/Button';

// Mock data for transactions
const mockTransactions = [
  {
    id: 1,
    date: '2025-07-10',
    amount: 50.00,
    type: 'donation',
    purpose: 'General fund',
    donor: 'Anonymous',
    location: 'London, UK'
  },
  {
    id: 2,
    date: '2025-07-09',
    amount: 25.00,
    type: 'adoption',
    purpose: 'Child sponsorship',
    donor: 'John S.',
    location: 'Manchester, UK'
  },
  {
    id: 3,
    date: '2025-07-09',
    amount: 100.00,
    type: 'donation',
    purpose: 'School building project',
    donor: 'Corporate Partner',
    location: 'Edinburgh, UK'
  },
  {
    id: 4,
    date: '2025-07-08',
    amount: 75.00,
    type: 'donation',
    purpose: 'Teacher training program',
    donor: 'Anonymous',
    location: 'New York, US'
  },
  {
    id: 5,
    date: '2025-07-07',
    amount: 25.00,
    type: 'adoption',
    purpose: 'Child sponsorship',
    donor: 'Sarah T.',
    location: 'Bristol, UK'
  },
  {
    id: 6,
    date: '2025-07-07',
    amount: 150.00,
    type: 'donation',
    purpose: 'School supplies',
    donor: 'Anonymous',
    location: 'Toronto, CA'
  },
  {
    id: 7,
    date: '2025-07-06',
    amount: 500.00,
    type: 'donation',
    purpose: 'General fund',
    donor: 'Anonymous',
    location: 'London, UK'
  },
  {
    id: 8,
    date: '2025-07-05',
    amount: 25.00,
    type: 'adoption',
    purpose: 'Child sponsorship',
    donor: 'Michael P.',
    location: 'Cardiff, UK'
  },
  {
    id: 9,
    date: '2025-07-05',
    amount: 200.00,
    type: 'donation',
    purpose: 'School meals program',
    donor: 'Local Business',
    location: 'Glasgow, UK'
  },
  {
    id: 10,
    date: '2025-07-04',
    amount: 1000.00,
    type: 'donation',
    purpose: 'Technology for schools',
    donor: 'Corporate Donor',
    location: 'London, UK'
  },
  {
    id: 11,
    date: '2025-07-03',
    amount: 25.00,
    type: 'adoption',
    purpose: 'Child sponsorship',
    donor: 'Emma L.',
    location: 'Birmingham, UK'
  },
  {
    id: 12,
    date: '2025-07-02',
    amount: 75.00,
    type: 'donation',
    purpose: 'General fund',
    donor: 'Anonymous',
    location: 'Sydney, AU'
  }
];

// Mock data for monthly summaries
const mockMonthlySummaries = [
  { month: 'July 2025', donations: 2175.00, expenses: 1950.00, projects: 5 },
  { month: 'June 2025', donations: 3250.00, expenses: 3000.00, projects: 6 },
  { month: 'May 2025', donations: 2800.00, expenses: 2650.00, projects: 4 },
  { month: 'April 2025', donations: 3100.00, expenses: 2900.00, projects: 5 },
];

// Mock data for expense allocation
const mockExpenseAllocation = [
  { category: 'Education Programs', percentage: 65 },
  { category: 'School Infrastructure', percentage: 15 },
  { category: 'Health & Nutrition', percentage: 10 },
  { category: 'Administration', percentage: 7 },
  { category: 'Fundraising', percentage: 3 }
];

const Ledger: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPurpose, setFilterPurpose] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(
    { key: 'date', direction: 'descending' }
  );

  // Filter and sort transactions
  const filteredTransactions = mockTransactions
    .filter(transaction => {
      const matchesSearch = 
        transaction.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesPurpose = filterPurpose === 'all' || transaction.purpose === filterPurpose;
      
      return matchesSearch && matchesType && matchesPurpose;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      
      let aValue = a[sortConfig.key as keyof typeof a];
      let bValue = b[sortConfig.key as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

  // Get unique purposes for filter
  const uniquePurposes = Array.from(new Set(mockTransactions.map(t => t.purpose)));

  // Handle sort
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header Section */}
      <section className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Public Ledger</h1>
            <p className="text-xl text-gray-300 mb-0">
              Transparency is one of our core values. View all donations and how they're being used.
            </p>
          </div>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Donations</h3>
              <p className="text-3xl font-bold text-blue-900">£11,325</p>
              <p className="text-sm text-blue-700 mt-2">Last 90 days</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Active Sponsors</h3>
              <p className="text-3xl font-bold text-green-900">152</p>
              <p className="text-sm text-green-700 mt-2">Supporting children</p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">Projects Funded</h3>
              <p className="text-3xl font-bold text-orange-900">11</p>
              <p className="text-sm text-orange-700 mt-2">Currently active</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Admin Costs</h3>
              <p className="text-3xl font-bold text-purple-900">7%</p>
              <p className="text-sm text-purple-700 mt-2">Of total funds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Summaries */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Monthly Financial Summaries</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Donations</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Expenses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects Funded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donation Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockMonthlySummaries.map((summary, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{summary.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">£{summary.donations.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">£{summary.expenses.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{summary.projects}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <Button
                        variant="text"
                        size="sm"
                        onClick={() => {/* Would open detailed view */}}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8">
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download Annual Report
            </Button>
          </div>
        </div>
      </section>

      {/* Expense Allocation */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">How Donations Are Used</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="space-y-4">
                {mockExpenseAllocation.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">{item.category}</span>
                      <span className="text-gray-900 font-medium">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          index === 0 ? 'bg-blue-600' : 
                          index === 1 ? 'bg-green-500' : 
                          index === 2 ? 'bg-orange-500' : 
                          index === 3 ? 'bg-purple-500' : 
                          'bg-gray-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Our Commitment to Efficiency</h3>
              <p className="text-gray-600 mb-4">
                At Obayi, we're committed to maximizing the impact of every donation. We maintain 
                low administrative costs to ensure that the majority of funds go directly to supporting 
                children's education and well-being.
              </p>
              <p className="text-gray-600 mb-4">
                Our financial reports are audited annually by independent auditors, and we maintain 
                complete transparency about how funds are allocated and spent.
              </p>
              <p className="text-gray-600">
                For detailed financial information, including our annual reports and tax filings, 
                please visit our <a href="#" className="text-blue-600 hover:underline">Financial Documents</a> page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transaction Ledger */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Recent Transactions</h2>
          
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div className="relative">
                  <select
                    id="typeFilter"
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="donation">Donations</option>
                    <option value="adoption">Child Sponsorships</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="purposeFilter" className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <div className="relative">
                  <select
                    id="purposeFilter"
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={filterPurpose}
                    onChange={(e) => setFilterPurpose(e.target.value)}
                  >
                    <option value="all">All Purposes</option>
                    {uniquePurposes.map((purpose, index) => (
                      <option key={index} value={purpose}>{purpose}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="self-end">
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterPurpose('all');
                }}>
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Transactions Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('date')}
                  >
                    <div className="flex items-center">
                      Date
                      <span className="ml-1">{getSortIcon('date')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('amount')}
                  >
                    <div className="flex items-center">
                      Amount
                      <span className="ml-1">{getSortIcon('amount')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('type')}
                  >
                    <div className="flex items-center">
                      Type
                      <span className="ml-1">{getSortIcon('type')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('purpose')}
                  >
                    <div className="flex items-center">
                      Purpose
                      <span className="ml-1">{getSortIcon('purpose')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('donor')}
                  >
                    <div className="flex items-center">
                      Donor
                      <span className="ml-1">{getSortIcon('donor')}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('location')}
                  >
                    <div className="flex items-center">
                      Location
                      <span className="ml-1">{getSortIcon('location')}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        £{transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === 'donation' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.type === 'donation' ? 'Donation' : 'Sponsorship'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.purpose}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.donor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.location}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No transactions found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing {filteredTransactions.length} of {mockTransactions.length} transactions
            </p>
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </section>

      {/* Transparency Notice */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-4">Our Commitment to Transparency</h3>
            <p className="text-blue-700 mb-4">
              Obayi is committed to complete financial transparency. Our public ledger 
              shows all donations received and how they are allocated, while protecting donor 
              privacy when requested.
            </p>
            <p className="text-blue-700 mb-4">
              We are a registered UK charity (No. 123456789) and comply with all relevant 
              regulations. Our financial statements are audited annually by independent auditors.
            </p>
            <p className="text-blue-700">
              If you have any questions about our financial practices or would like more detailed 
              information, please <a href="/contact" className="text-blue-800 underline">contact us</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ledger;