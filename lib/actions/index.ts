'use server';

import DataStore from '@/database/petDataStore.model';
import { connectToDatabase } from '../connectToDatabase';
import {
  scrapeAttribute,
  scrapeMultiURLs,
  scrapeStoneAgeLinks,
} from '../scraper';

export const getDataFromSAPage = async (URL: string) => {
  try {
    await connectToDatabase();
    if (!URL) {
      return;
    }
    const scrapedData = await scrapeStoneAgeLinks(URL);
    if (!scrapedData) {
      return;
    }

    console.log('now scraping the data array......');
    const data = await scrapeMultiURLs(scrapedData);
    if (!data) {
      return;
    }

    const links = data.map((item) => item.links);
    // console.log('Scraped links:', links);
    // loop links and scrape the attribute
    console.log('Scrapping attributes:...');
    const petAttributes = await scrapeAttribute(links);
    console.log('Scraped pet attribute:', petAttributes);

    // add data to the database

    return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape the product ${error.message}`);
  }
};
