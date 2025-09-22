// 'use client';

// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// import { getSafeImageUrl } from '@/utils/imageUtils';
// import { StatusBadge } from '@/components/reusable';
// import { formatCurrencyCompact } from '@/utils/currency';

// type PropertyStatus = 'pending' | 'private' | 'public' | 'sold' | 'withdrawn';

// interface PropertyCardProps {
//   id: string;
//   slug?: string; // Add slug prop
//   title: string;
//   address: string;
//   price: number | null | undefined;
//   beds: number | null | undefined;
//   baths: number | null | undefined;
//   size: number | null | undefined; // This will now be in square meters
//   image: string;
//   status?: PropertyStatus;
//   featured?: boolean;
//   className?: string;
//   onClick?: () => void;
// }

// export default function PropertyCard({
//   id,
//   slug,
//   title,
//   address,
//   price,
//   beds,
//   baths,
//   size,
//   image,
//   status,
//   featured = false,
//   className = '',
//   onClick
// }: PropertyCardProps) {
//   console.log("🚀 ~ PropertyCard ~ image:", image)
//   // Format size function with null check
//    // Decide target path (RELATIVE!) so Next can navigate without reload
//   const [targetPath, setTargetPath] = useState('/signin');

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('token');
//       setTargetPath(token ? '/property/test123-test-test-eae053' : '/signin');
//     }
//   }, []);
//   const formatSize = (size: number | undefined | null) => {
//     if (size == null || isNaN(size)) {
//       return 'N/A';
//     }
//     return `${size.toLocaleString()} m²`;
//   };

//   // Safe price formatting
//   function formatSafePrice(price: number | null): string {
//     if (price === null || price === undefined || isNaN(price)) {
//       return 'Price on Request';
//     }
//     return formatCurrencyCompact(price);
//   }

//   // Safe number formatting for beds/baths
//   const formatSafeNumber = (num: number | undefined | null) => {
//     if (num == null || isNaN(num)) {
//       return 0;
//     }
//     return num;
//   };

//   // Handle click function
//   const handleClick = () => {
//     if (onClick) {
//       onClick();
//     }
//   };

//   // Get safe image URL and handle empty cases
//   const safeImageUrl = getSafeImageUrl(image, 'property');
//   const hasValidImage = safeImageUrl && safeImageUrl.trim() !== '';

//   const CardContent = (
//     <>
//       <div className="relative h-48 bg-gray-200 overflow-hidden">
//         {hasValidImage ? (
//           <img
//             src={safeImageUrl}
//             alt={`${title} - ${address}`}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//             onError={(e) => {
//               const target = e.target as HTMLImageElement;
//               // Hide the image on error instead of trying another empty URL
//               target.style.display = 'none';
//             }}
//           />
//         ) : (
//           // Show a placeholder div when no valid image is available
//           <div className="w-full h-full flex items-center justify-center bg-gray-100">
//             <div className="text-center text-gray-400">
//               <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//               <p className="text-xs">No Image</p>
//             </div>
//           </div>
//         )}
        
//         {/* Featured Badge */}
//         {featured && (
//           <div className="absolute top-3 left-3">
//             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" aria-label="Featured property">
//               Featured
//             </span>
//           </div>
//         )}

//         {/* Status Badge */}
//         {status && (
//           <div className={`absolute top-3 ${featured ? 'left-3 mt-8' : 'left-3'}`}>
//             <StatusBadge status={status} size="sm" />
//           </div>
//         )}

//         {/* Price Badge */}
//         <div className="absolute top-3 right-3">
//           <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-semibold bg-white text-gray-900 shadow-sm" aria-label={`Price: ${formatSafePrice(price)}`}>
//             {formatSafePrice(price)}
//           </span>
//         </div>

//         {/* Hover Overlay */}
//         <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" aria-hidden="true" />
//       </div>

//       {/* Content */}
//       <div className="p-4">
//         {/* Title */}
//         <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
//           {title}
//         </h3>

//         {/* Address */}
//         <p className="text-sm text-gray-600 mb-3 line-clamp-1">
//           {address}
//         </p>

//         {/* Price and Property Details */}
//         <div className="flex items-center justify-between mt-2">
//           <span className="text-lg font-semibold text-gray-900">
//             {formatSafePrice(price)}
//           </span>
//           <div className="flex gap-4 text-sm text-gray-600">
//             {formatSafeNumber(beds) && (
//               <span className="flex items-center gap-1">
//                 <span>{formatSafeNumber(beds)} Beds</span>
//               </span>
//             )}
//             {formatSafeNumber(baths) && (
//               <span className="flex items-center gap-1">
//                 <span>{formatSafeNumber(baths)} Baths</span>
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Size */}
//         {formatSize(size) && (
//           <div className="mt-2">
//             <span className="text-sm text-gray-600">
//               {formatSize(size)}
//             </span>
//           </div>
//         )}

//         {/* View Details Button */}
//         <div className="flex items-center justify-between mt-4">
//           <span className="text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors duration-200">
//             {onClick ? 'Select Property' : 'View Details'}
//             <svg className="inline-block w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//           </span>
//         </div>
//       </div>
//     </>
//   );

//   // If onClick is provided, render as button, otherwise as Link
//   if (onClick) {
//     return (
//       <article className={`group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 cursor-pointer ${className}`}>
//         <Link
//           href={targetPath}
//           onClick={() => onClick?.()}
//           className="block focus:outline-none"
//           aria-label={`Select ${title || 'Property'} at ${address || 'Unknown location'} - ${formatSafePrice(price)}`}
//         >
//           {CardContent}
//         </Link>
//       </article>

//     );
//   }

//   return (
//     <article className={`group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${className}`}>
//       <Link
//    href={targetPath}
//         className="block focus:outline-none"
//         aria-label={`View details for ${title || 'Property'} at ${address || 'Unknown location'} - ${formatSafePrice(price)}`}
//       >
//         {CardContent}
//       </Link>
//     </article>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSafeImageUrl } from '@/utils/imageUtils';
import { StatusBadge } from '@/components/reusable';
import { formatCurrencyCompact } from '@/utils/currency';

type PropertyStatus = 'pending' | 'private' | 'public' | 'sold' | 'withdrawn';

interface PropertyCardProps {
  id: string;
  slug?: string;
  title: string;
  address: string;
  price: number | null | undefined;
  beds: number | null | undefined;
  baths: number | null | undefined;
  size: number | null | undefined;
  image: string;
  status?: PropertyStatus;
  featured?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function PropertyCard({
  id,
  slug,
  title,
  address,
  price,
  beds,
  baths,
  size,
  image,
  status,
  featured = false,
  className = '',
  onClick
}: PropertyCardProps) {
  const [targetPath, setTargetPath] = useState('/signin');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setTargetPath(token ? `/property/${slug || id}` : '/signin');
    }
  }, [slug, id]);

  // --- 🔑 Stripe Checkout Logic ---
  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      // Not logged in → redirect to signin
      window.location.href = '/signin';
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/payment/checkout/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.alreadyPaid) {
        // Already purchased → go directly to details
        window.location.href = `/property/${slug || id}`;
      } else if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert('Something went wrong creating checkout session.');
      }
    } catch (err) {
      console.error('Stripe checkout error:', err);
      alert('Unable to start checkout.');
    }
  };

  // --- Size, Price, Safe Formatters (your original functions) ---
  const formatSize = (size: number | undefined | null) =>
    size == null || isNaN(size) ? 'N/A' : `${size.toLocaleString()} m²`;

  const formatSafePrice = (price: number | null) =>
    price == null || isNaN(price) ? 'Price on Request' : formatCurrencyCompact(price);

  const formatSafeNumber = (num: number | undefined | null) =>
    num == null || isNaN(num) ? 0 : num;

  const safeImageUrl = getSafeImageUrl(image, 'property');
  const hasValidImage = safeImageUrl && safeImageUrl.trim() !== '';

  // --- Render ---
  return (
    <article
      className={`group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${className}`}
    >
   <button
        type="button"
        onClick={handleCheckout}
        className="block w-full text-left focus:outline-none"
        aria-label={`View details for ${title} - ${formatSafePrice(price)}`}
      >
        {/* --- CardContent (your existing markup unchanged) --- */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          {hasValidImage ? (
            <img
              src={safeImageUrl}
              alt={`${title} - ${address}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-xs text-gray-400">No Image</p>
            </div>
          )}
          {featured && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Featured
              </span>
            </div>
          )}
          {status && (
            <div className="absolute top-3 left-3 mt-8">
              <StatusBadge status={status} size="sm" />
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white px-2.5 py-1 rounded-md shadow-sm">
            {formatSafePrice(price)}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-1">{address}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-semibold text-gray-900">
              {formatSafePrice(price)}
            </span>
            <div className="flex gap-4 text-sm text-gray-600">
              {beds && <span>{beds} Beds</span>}
              {baths && <span>{baths} Baths</span>}
            </div>
          </div>
          {size && (
            <div className="mt-2 text-sm text-gray-600">{formatSize(size)}</div>
          )}
          <div className="mt-4 text-blue-600 font-medium text-sm">
            View Details →
          </div>
        </div>
      </button>
    </article>
  );
}
