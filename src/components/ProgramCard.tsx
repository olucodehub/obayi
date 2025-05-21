import React from 'react';
import { Calendar } from 'lucide-react';
import Button from './Button';

interface ProgramCardProps {
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  date?: string;
  impact?: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  title,
  description,
  imageUrl,
  location,
  date,
  impact,
}) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    upcoming: 'bg-orange-100 text-orange-800',
  };

  const statusText = {
    active: 'Active',
    completed: 'Completed',
    upcoming: 'Upcoming',
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {statusText[status]}
          </span>
          
          {date && (
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{date}</span>
            </div>
          )}
        </div>
        
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        
        <p className="text-gray-600 mb-4">{description}</p>
        
        {impact && (
          <div className="bg-gray-50 p-3 rounded mb-4">
            <p className="text-sm font-medium">Impact: {impact}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">{location}</span>
          <Button variant="outline" size="sm" to={`/programs/${title.toLowerCase().replace(/\s+/g, '-')}`}>
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;