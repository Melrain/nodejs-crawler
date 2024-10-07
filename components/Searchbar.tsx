'use client';
import { getDataFromSAPage } from '@/lib/actions';
import { scrape17173Pets } from '@/lib/scraper';

import React, { FormEvent, useState } from 'react';

const isValidAmazonProductURL = (url: string) => {
  try {
    const paredURL = new URL(url);
    const hostname = paredURL.hostname;

    // Check if hostname contains amazon.com or amazon
    if (
      hostname.includes('amazon.com') ||
      hostname.includes('amazon.') ||
      hostname.includes('amazon')
    ) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = searchPrompt;
    if (!isValidLink) {
      alert('Invalid Amazon Product URL');
      return;
    }

    try {
      setIsLoading(true);
      // Scrape the product page
      // const product = await scrapeAndStoreProduct(searchPrompt);
      // const response = await getDataFromSAPage(searchPrompt);
      // if (!response) {
      //   alert('Failed to scrape the product');
      //   return;
      // }
      const response = await scrape17173Pets(searchPrompt);
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <form className='mt-12 flex flex-wrap gap-4' onSubmit={handleSubmit}>
        <input
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
          type='text'
          placeholder='Enter Product link'
          className='searchbar-input'
        />
        <button
          disabled={isLoading || searchPrompt === ''}
          type='submit'
          className='searchbar-btn'
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default Searchbar;
