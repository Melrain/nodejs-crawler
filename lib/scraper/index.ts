'use server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from '../utils';
import PetDataStore from '@/database/petDataStore.model';

// export const scrapeAmazonProduct = async (URL: string) => {
//   if (!URL) {
//     return;
//   }
//   // BrightData proxy configuration

//   const username = String(process.env.BRIGHT_DATA_USERNAME);
//   const password = String(process.env.BRIGHT_DATA_PASSWORD);
//   const port = 22225;
//   const session_id = Math.floor(Math.random() * 10000) | 0;
//   const options = {
//     auth: {
//       username: `${username}-session-${session_id}`,
//       password: password,
//     },
//     host: 'brd.superproxy.io',
//     port: port,
//     rejectUnauthorized: false,
//   };

//   if (!username || !password) {
//     throw new Error('BrightData credentials not found');
//   }
//   try {
//     //Fetch the product page
//     const response = await axios.get(URL, options);
//     const $ = cheerio.load(response.data);
//     //Extract the product details

//     // Define the price selectors
//     const priceSelectors = [
//       // $('.apexPriceToPay .a-offscreen'),
//       $('.priceToPay span.a-price-whole'),
//       // $('.a.size.base.a-color-price'),
//       // $('.a-button-selected .a-color-base'),
//     ];
//     const disCountSelectors = [$('.savingsPercentage')];
//     const originalPriceSelectors = [
//       $(
//         '.a-price.a-text-price[data-a-size="s"][data-a-strike="true"][data-a-color="secondary"] .a-offscreen',
//       ),
//       $(
//         '.a-price.a-text-price[data-a-size="s"][data-a-strike="true"][data-a-color="secondary"] span[aria-hidden="true"]',
//       ),
//     ];

//     // Extract the price using the helper function
//     const title = $('#productTitle').text().trim();
//     const inStock =
//       $('#availability span').text().trim().toLowerCase() === 'in stock';
//     const currentPrice = extractPrice(...priceSelectors);
//     const originalPrice = extractPrice(...originalPriceSelectors);
//     const images = $('#landingImage').attr('data-a-dynamic-image') || '{}';
//     const imageUrls = Object.keys(JSON.parse(images));
//     const currency = extractCurrency($('span.a-price-symbol'));
//     const discountRate = $('.a-section .savingsPercentage')
//       .text()
//       .replace(/[-%]/g, '');
//     const description = extractDescription($);

//     // construct data object with scraped information
//     const data = {
//       url: URL,
//       images: imageUrls || [],
//       currency: currency || '$',
//       title: title,
//       currentPrice: Number(currentPrice) || Number(originalPrice),
//       originalPrice: Number(originalPrice) || Number(currentPrice),
//       priceHistory: [],
//       discountRate: Number(discountRate) || 0,
//       category: 'category',
//       reviewsCount: 100,
//       starts: 4.5,
//       inStock: inStock,
//       description: description,
//       lowestPrice: Number(currentPrice) || Number(originalPrice),
//       highestPrice: Number(originalPrice) || Number(currentPrice),
//       average: Number(currentPrice) || Number(originalPrice),
//     };

//     return data;
//   } catch (error: any) {
//     throw new Error(`Failed to scrape the product ${error.message}`);
//   }
// };

export const scrapeStoneAgeLinks = async (url: string) => {
  if (!url) {
    return;
  }
  // BrightData proxy configuration

  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = Math.floor(Math.random() * 10000) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password: password,
    },
    host: 'brd.superproxy.io',
    port: port,
    rejectUnauthorized: false,
  };

  if (!username || !password) {
    throw new Error('BrightData credentials not found');
  }
  try {
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    // Extract href links
    const links: string[] = [];
    $('#petimagesmenu a').each((index, element) => {
      let href = $(element).attr('href');
      if (href) {
        if (!href.startsWith('http')) {
          href = new URL(href, url).href;
        }
        links.push(href);
      }
    });

    return links;
  } catch (error: any) {
    throw new Error(`Failed to scrape the product: ${error.message}`);
  }
};

interface ImageData {
  url: string;
  images: string[];
  links: string[];
}
// 主函数
export const scrapeMultiURLs = async (urls: string[]): Promise<ImageData[]> => {
  // 代理选项设定
  const options = proxySetup();

  // 存储数据的数组
  let data: ImageData[] = [];

  try {
    // 遍历URL列表
    for (const url of urls) {
      // 发起HTTP GET请求
      const response = await axios.get(url, options);
      // 使用cheerio加载HTML
      const $ = cheerio.load(response.data);

      // 初始化当前URL的图片数组
      const imageUrls: string[] = [];
      const links: string[] = [];

      // 提取所有的<img>标签的src属性，并转换为绝对URL
      $('img').each((index, element) => {
        const src = $(element).attr('src');
        if (src) {
          const absoluteURL = new URL(src, url).href;
          imageUrls.push(absoluteURL);
        }
      });

      // 提取所有的<a>标签的href属性，并转换为绝对URL
      $('table#menu a').each((index, element) => {
        const href = $(element).attr('href');
        if (href) {
          const absoluteURL = new URL(href, url).href;
          links.push(absoluteURL);
        }
      });

      // 将结果添加到数据数组中
      data.push({
        url,
        images: imageUrls,
        links,
      });
    }
  } catch (error) {
    // 错误处理
    console.error('Error scraping URLs:', error);
  }

  // 返回结果
  return data;
};

// 代理设置
const proxySetup = () => {
  if (!URL) {
    return;
  }
  // BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = Math.floor(Math.random() * 10000) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password: password,
    },
    host: 'brd.superproxy.io',
    port: port,
    rejectUnauthorized: false,
  };

  if (!username || !password) {
    throw new Error('BrightData credentials not found');
  }
  return options;
};

interface petAttributes {
  groupUrl: string;
  id: number;
  name: string;
  image: string;
  element: string;
  subElement: string;
  minHp: number;
  maxHp: number;
  minHpGrowth: number;
  maxHpGrowth: number;
  minAtk: number;
  maxAtk: number;
  minAtkGrowth: number;
  maxAtkGrowth: number;
  minDef: number;
  maxDef: number;
  minDefGrowth: number;
  maxDefGrowth: number;
  minSpeed: number;
  maxSpeed: number;
  minSpeedGrowth: number;
  maxSpeedGrowth: number;
}

export const scrapeAttribute = async (
  urls: string[][],
): Promise<(petAttributes | null)[][]> => {
  const results: (petAttributes | null)[][] = [];

  // 重试逻辑的帮助函数
  const fetchData = async (
    url: string,
    retries: number = 3,
  ): Promise<string | null> => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        const options = proxySetup();
        const response = await axios.get(url, { ...options, timeout: 5000 }); // 设置超时
        return response.data;
      } catch (error: any) {
        console.error(`Error fetching data from ${url}:`, error);
        if (error.code !== 'ECONNRESET' || attempt >= retries - 1) {
          return null;
        }
        attempt++;
        console.log(`Retrying (${attempt}/${retries})...`);
      }
    }
    return null;
  };

  for (const urlList of urls) {
    const subResults: (petAttributes | null)[] = [];
    for (const url of urlList) {
      const data = await fetchData(url);
      if (data) {
        try {
          const $ = cheerio.load(data);

          // 提取文本并删除无效字符的帮助函数
          const extractText = (selector: string) => $(selector).text().trim();
          const extractNumberRange = (selector: string) => {
            const text = extractText(selector);
            const [min, max] = text.split(' ~ ').map(parseFloat);
            return { min, max };
          };

          // 获取宠物名称和描述

          const name = extractText("th:contains('寵物名稱') + td");
          const image = url;
          // 获取元素和子元素并增加调试日志
          const elementTh = $("th:contains('寵物屬性')");
          const elementTd = elementTh.next('td');
          const elementSpan1 = elementTd
            .find('span:nth-of-type(1)')
            .text()
            .trim();
          const elementSpan2 = elementTd
            .find('span:nth-of-type(2)')
            .text()
            .trim();

          // 合并属性值
          const element = elementSpan1;
          const subElement = elementSpan2;

          // 获取属性值
          const match = url.match(/[?&]pet_id=(\d+)/);
          const petId = match ? parseInt(match[1]) : 0;
          const hp = extractNumberRange("th:contains('血值') + td");
          const hpGrowth = extractNumberRange("th:contains('血成長') + td");
          const atk = extractNumberRange("th:contains('攻值') + td");
          const atkGrowth = extractNumberRange("th:contains('攻成長') + td");
          const def = extractNumberRange("th:contains('防值') + td");
          const defGrowth = extractNumberRange("th:contains('防成長') + td");
          const speed = extractNumberRange("th:contains('敏值') + td");
          const speedGrowth = extractNumberRange("th:contains('敏成長') + td");

          const pet: petAttributes = {
            id: petId,
            groupUrl: url,
            name,
            image,
            element,
            subElement,
            minHp: hp.min,
            maxHp: hp.max,
            minHpGrowth: hpGrowth.min,
            maxHpGrowth: hpGrowth.max,
            minAtk: atk.min,
            maxAtk: atk.max,
            minAtkGrowth: atkGrowth.min,
            maxAtkGrowth: atkGrowth.max,
            minDef: def.min,
            maxDef: def.max,
            minDefGrowth: defGrowth.min,
            maxDefGrowth: defGrowth.max,
            minSpeed: speed.min,
            maxSpeed: speed.max,
            minSpeedGrowth: speedGrowth.min,
            maxSpeedGrowth: speedGrowth.max,
          };

          const result = await PetDataStore.create(pet);
          console.log('Data saved:', result);

          subResults.push(pet);
        } catch (error) {
          console.error(`Error parsing data from ${url}:`, error);
          subResults.push(null);
        }
      } else {
        subResults.push(null);
      }
    }
    results.push(subResults);
  }

  return results;
};

// 从17173网站上爬取宠物数据
export const scrape17173Pets = async (url: string) => {
  if (!url) {
    return;
  }
  // BrightData proxy configuration

  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = Math.floor(Math.random() * 10000) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password: password,
    },
    host: 'brd.superproxy.io',
    port: port,
    rejectUnauthorized: false,
  };

  if (!username || !password) {
    throw new Error('BrightData credentials not found');
  }
  try {
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);
    console.log(response.data);
    return response.data;

    // 提取宠物链接
  } catch (error: any) {
    throw new Error(`Failed to scrape the product: ${error.message}`);
  }
};
