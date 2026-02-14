import React from 'react';
import { GroundingChunk } from '../types';

interface MapSourceCardProps {
  chunk: GroundingChunk;
}

export const MapSourceCard: React.FC<MapSourceCardProps> = ({ chunk }) => {
  if (!chunk.maps) return null;

  const { title, uri } = chunk.maps;

  return (
    <a
      href={uri}
      target="_blank"
      rel="noopener noreferrer"
      className="block group bg-white border border-gray-200 hover:border-google-blue/50 hover:shadow-md transition-all rounded-xl overflow-hidden max-w-sm flex-shrink-0 w-64"
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-google-blue transition-colors">
              {title}
            </h4>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3 text-google-red" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Google Maps
            </p>
          </div>
          <div className="flex-shrink-0 bg-gray-50 p-2 rounded-lg group-hover:bg-blue-50 transition-colors">
             <svg className="w-5 h-5 text-gray-400 group-hover:text-google-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
             </svg>
          </div>
        </div>
      </div>
    </a>
  );
};
