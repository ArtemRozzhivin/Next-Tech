'use client';

import algoliasearch from 'algoliasearch/lite';
import { Highlight, Hits, SearchBox } from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';

const searchClient = algoliasearch('Q2QOIT41TW', '85a4843a67348da0ea7172f8738466ac');

function Hit({ hit }) {
  return (
    <article>
      <img src={hit.image} alt={hit.name} />
      {/* <p>{hit.categories[0]}</p> */}
      <h1>
        <Highlight attribute='product.model' hit={hit} />
      </h1>
      <p>${hit.product.price}</p>
    </article>
  );
}

export function Search() {
  return (
    <InstantSearchNext indexName='product_search' searchClient={searchClient}>
      <SearchBox
        classNames={{
          // form: 'relative bg-white',
          input:
            'shadow-lg block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-md focus:ring-1',
          submitIcon: 'hidden',
          resetIcon: 'hidden',
        }}
      />
      <Hits hitComponent={Hit} />
    </InstantSearchNext>
  );
}
