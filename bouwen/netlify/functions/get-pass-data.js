// netlify/functions/get-pass-data.js
// This simpler version returns the pass JSON data without signing
// Users will need an app like "Pass2U Wallet" that can create passes from JSON

exports.handler = async (event, context) => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };
  
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: '',
      };
    }
  
    const passData = {
      formatVersion: 1,
      passTypeIdentifier: 'pass.com.daandouwe.businesscard',
      serialNumber: `DD-${Date.now()}`,
      teamIdentifier: 'XXXXXXXXXX',
      organizationName: 'Daan Douwe Bouwen',
      description: 'Daan Douwe van Stigt - Business Card',
      foregroundColor: 'rgb(6, 59, 64)',
      backgroundColor: 'rgb(247, 236, 214)',
      labelColor: 'rgb(6, 59, 64)',
      logoText: 'Daan Douwe Bouwen',
      
      generic: {
        primaryFields: [
          {
            key: 'name',
            label: 'NAME',
            value: 'Daan Douwe van Stigt'
          }
        ],
        secondaryFields: [
          {
            key: 'title',
            label: 'PROFESSION',
            value: 'Timmerman & Aannemer'
          },
          {
            key: 'company',
            label: 'COMPANY',
            value: 'Daan Douwe Bouwen'
          }
        ],
        auxiliaryFields: [
          {
            key: 'email',
            label: 'EMAIL',
            value: 'bouwen@daandouwe.com',
            link: 'mailto:bouwen@daandouwe.com'
          },
          {
            key: 'website',
            label: 'WEBSITE',
            value: 'daandouwe.com',
            link: 'https://daandouwe.com/bouwen'
          }
        ],
        backFields: [
          {
            key: 'address',
            label: 'LOCATION',
            value: 'Amsterdam, Nederland'
          },
          {
            key: 'kvk',
            label: 'Chamber of Commerce',
            value: '97741256'
          },
          {
            key: 'linkedin',
            label: 'LINKEDIN',
            value: 'View Profile',
            link: 'https://www.linkedin.com/in/daan-🔨-van-stigt-713772133/'
          },
          {
            key: 'github',
            label: 'GITHUB',
            value: 'View Profile',
            link: 'https://github.com/daandouwe'
          },
          {
            key: 'note',
            label: 'ABOUT',
            value: 'Professional carpenter and contractor specializing in quality construction and renovation projects in Amsterdam. Available for both residential and commercial projects.'
          }
        ]
      },
      
      barcode: {
        format: 'PKBarcodeFormatQR',
        message: 'https://daandouwe.com/bouwen/daandouwe.vcf',
        messageEncoding: 'iso-8859-1',
        altText: 'daandouwe.com'
      }
    };
  
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passData),
    };
  };