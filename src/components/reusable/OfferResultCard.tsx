import { formatCurrencyCompact } from '@/utils/currency';

interface OfferResultCardProps {
  estimatedValue: number;
  address: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  estimatedClosingDate: string;
  onAccept?: () => void;
  onDecline?: () => void;
  className?: string;
}

export default function OfferResultCard({
  estimatedValue,
  address,
  propertyType,
  bedrooms,
  bathrooms,
  squareFootage,
  estimatedClosingDate,
  onAccept,
  onDecline,
  className = ""
}: OfferResultCardProps) {
  // Remove the old formatCurrency function
  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  //   }).format(amount);
  // };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cash Offer</h2>
        <p className="text-gray-600">Based on your property details</p>
      </div>

      {/* Property Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">{address}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Type:</span> {propertyType}
          </div>
          <div>
            <span className="font-medium">Bedrooms:</span> {bedrooms}
          </div>
          <div>
            <span className="font-medium">Bathrooms:</span> {bathrooms}
          </div>
          <div>
            <span className="font-medium">Square Feet:</span> {squareFootage.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Offer Amount */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-blue-600 mb-2">
          {formatCurrencyCompact(estimatedValue)}
        </div>
        <p className="text-gray-600">Estimated Cash Offer</p>
      </div>

      {/* Estimated Closing */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-blue-600 font-medium">
            Estimated Closing: {estimatedClosingDate}
          </span>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">What's Next?</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Schedule a property inspection
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Review final offer details
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Choose your closing date
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onAccept}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
        >
          Accept Offer
        </button>
        <button
          onClick={onDecline}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
        >
          Decline
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        This is an estimated offer. Final offer amount will be determined after property inspection.
      </p>
    </div>
  );
}