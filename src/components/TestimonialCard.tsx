import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  imageUrl?: string;
  rating?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  role,
  imageUrl,
  rating = 5,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
      {rating > 0 && (
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      )}
      
      <blockquote className="mb-6">
        <p className="text-gray-700 italic leading-relaxed">"{quote}"</p>
      </blockquote>
      
      <div className="flex items-center">
        {imageUrl && (
          <div className="mr-4">
            <img 
              src={imageUrl} 
              alt={name} 
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>
        )}
        
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;