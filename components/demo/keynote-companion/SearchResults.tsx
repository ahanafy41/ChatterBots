/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { GroundingChunk } from '@google/genai';

type SearchResultsProps = {
  results: GroundingChunk[];
};

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-28 left-4 rtl:left-auto rtl:right-4 bg-gray-900/80 backdrop-blur-sm border border-gray-700 p-4 rounded-xl max-w-sm max-h-56 overflow-y-auto z-30 shadow-lg text-sm">
      <h4 className="font-bold text-gray-400 mb-2">المصادر:</h4>
      <ul className="list-none p-0 m-0 flex flex-col gap-2">
        {results.map((chunk, index) =>
          chunk.web ? (
            <li key={index}>
              <a
                href={chunk.web.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline block whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {chunk.web.title || chunk.web.uri}
              </a>
            </li>
          ) : null,
        )}
      </ul>
    </div>
  );
};

export default SearchResults;
