import axios from 'axios';
import cheerio from 'cheerio';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';

const baseUrl = "https://usa.mantralingua.com";
const startUrl = baseUrl + "/product-type/Book";

const fetchProductData = async (url) => {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const products = [];

    // Load product data
    $('ul.products li').each((index, element) => {
        const productName = $(element).find('h3').text()
        const fproductName = productName.split('\n').map(line => line.trim()).join('');
        const productPrice = $(element).find('.price').text().trim();
        const productUrl = baseUrl + $(element).find('a').attr('href');
        
        products.push({ name: fproductName, price: productPrice , productUrl:productUrl});
    });

    // Find next page URL for pagination
    const nextPageUrl = $('li.pager-next a').attr('href');

    return { products, nextPageUrl };
};

const fetchAllProducts = async (startUrl) => {
    let currentPageUrl = startUrl;
    let allProducts = [];

    // Loop through pages until there's no more next page
    while (currentPageUrl) {
        const { products, nextPageUrl } = await fetchProductData(currentPageUrl);
        allProducts = allProducts.concat(products);
        currentPageUrl = nextPageUrl ? baseUrl + nextPageUrl : null;
    }

    return allProducts;
};

fetchAllProducts(startUrl)
    .then((allProducts) => {
        const csvWriter = createObjectCsvWriter({
            path: 'products.csv',
            header: [
                { id: 'name', title: 'Name' },
                { id: 'price', title: 'Price' },
                { id: 'productUrl', title: 'Product URL' }
            ]
        });

        csvWriter
            .writeRecords(allProducts)
            .then(() => console.log('The CSV file was written successfully'));
    })
    .catch((error) => {
        console.error("Error fetching products:", error);
    });
