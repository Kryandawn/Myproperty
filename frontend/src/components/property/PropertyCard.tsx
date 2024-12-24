import React from 'react';
import { theme } from '../../styles/theme';

const PropertyCard = ({ property }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: theme.colors.lightGray }}>
      <img src={property.imageUrl} alt={property.title} className="w-full h-48 object-cover"/>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
        <p className="text-gray-600 mb-2">${property.price.toLocaleString()}</p>
        <div className="flex space-x-4 text-sm">
          <span>{property.bedrooms} beds</span>
          <span>{property.bathrooms} baths</span>
          <span>{property.area_sqft} sqft</span>
        </div>
        <button 
          className="mt-4 w-full py-2 px-4 rounded"
          style={{ 
            backgroundColor: theme.colors.steelBlue,
            color: theme.colors.lightGray
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
