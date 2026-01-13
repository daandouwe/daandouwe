const https = require('https');

// Fetch images from Cloudinary folder using Admin API
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_FOLDER || 'portfolio';

  if (!cloudName || !apiKey || !apiSecret) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Cloudinary credentials not configured' }),
    };
  }

  try {
    // Fetch images from Cloudinary Admin API
    const images = await fetchCloudinaryImages(cloudName, apiKey, apiSecret, folder);

    // Transform to optimized URLs (high resolution, high quality)
    const imageUrls = images.map(img => ({
      url: `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_90,w_1200/${img.public_id}.${img.format}`,
      thumbnail: `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_85,w_400,c_fill/${img.public_id}.${img.format}`,
      full: `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_95/${img.public_id}.${img.format}`,
      id: img.public_id,
      width: img.width,
      height: img.height,
    }));

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: imageUrls }),
    };
  } catch (error) {
    console.error('Cloudinary error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch images' }),
    };
  }
};

function fetchCloudinaryImages(cloudName, apiKey, apiSecret, folder) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const options = {
      hostname: 'api.cloudinary.com',
      path: `/v1_1/${cloudName}/resources/image?type=upload&prefix=${folder}/&max_results=100`,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.resources) {
            // Sort by upload date (newest first)
            const sorted = parsed.resources.sort((a, b) => {
              return new Date(b.created_at) - new Date(a.created_at);
            });
            resolve(sorted);
          } else {
            reject(new Error(parsed.error?.message || 'Unknown error'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}
