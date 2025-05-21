import React from 'react';
import { Heart } from 'lucide-react';
import Button from './Button';

interface DonationCardProps {
  amount: number;
  description: string;
  impact?: string;
  recommended?: boolean;
  onSelect: (amount: number) => void;
}

const DonationCard: React.FC<DonationCardProps> = ({ 
  amount, 
  description, 
  impact, 
  recommended = false,
  onSelect
}) => {
  return (
    <div 
      className={`rounded-lg border p-6 transition-all ${
        recommended 
          ? 'border-orange-500 bg-orange-50 shadow-md' 
          : 'border-gray-200 bg-white hover:shadow-md'
      }`}
    >
      {recommended && (
        <div className="flex justify-center -mt-10 mb-4">
          <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Recommended
          </span>
        </div>
      )}
      
      <div className="flex items-center justify-center mb-4">
        <Heart className={`h-10 w-10 ${recommended ? 'text-orange-500' : 'text-gray-400'}`} />
      </div>
      
      <h3 className="text-2xl font-bold text-center mb-2">£{amount}</h3>
      
      <p className="text-gray-600 text-center mb-4">{description}</p>
      
      {impact && (
        <div className={`p-3 rounded-md mb-6 ${recommended ? 'bg-white' : 'bg-gray-50'}`}>
          <p className="text-sm text-center font-medium">
            {impact}
          </p>
        </div>
      )}
      
      <Button 
        variant={recommended ? 'primary' : 'outline'} 
        fullWidth
        onClick={() => onSelect(amount)}
      >
        Donate £{amount}
      </Button>
    </div>
  );
};

export default DonationCard;