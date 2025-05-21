
import React from 'react';
import { Check } from 'lucide-react';

interface PlanDetailsSectionProps {
  plan: any;
  platformNames: string[];
  formatDuration: (plan: any) => string;
}

const PlanDetailsSection = ({ plan, platformNames, formatDuration }: PlanDetailsSectionProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{plan?.name}</h1>
      <p className="text-gray-600 mb-6">{plan?.description}</p>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Included Platforms</h2>
        <div className="space-y-3">
          {platformNames.map((platform, i) => (
            <div key={i} className="flex items-center p-3 bg-gray-50 rounded-md">
              <Check className="h-5 w-5 mr-3 text-green-500" />
              <span>{platform}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Plan Benefits</h2>
        <ul className="space-y-2">
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
            <span>Full access to all courses on included platforms</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
            <span>Premium account privileges on each platform</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
            <span>Certificates of completion (where available)</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
            <span>Access to exclusive downloadable resources</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PlanDetailsSection;
