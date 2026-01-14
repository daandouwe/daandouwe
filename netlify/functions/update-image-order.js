const https = require('https');

// Update the sort order of images in Cloudinary using context metadata
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method not allowed' };
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Cloudinary credentials not configured' }),
    };
  }

  try {
    const { images } = JSON.parse(event.body);

    if (!images || !Array.isArray(images)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'images array is required' }),
      };
    }

    // Update each image with its sort order
    const results = await Promise.all(
      images.map((img, index) =>
        updateImageContext(cloudName, apiKey, apiSecret, img.id, index)
      )
    );

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, updated: results.length }),
    };
  } catch (error) {
    console.error('Update order error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update image order' }),
    };
  }
};

function updateImageContext(cloudName, apiKey, apiSecret, publicId, sortOrder) {
  return new Promise((resolve, reject) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const context = `sort_order=${sortOrder}`;
    const signature = generateSignature(publicId, context, timestamp, apiSecret);

    const postData = new URLSearchParams({
      public_id: publicId,
      context: context,
      timestamp: timestamp.toString(),
      api_key: apiKey,
      signature: signature,
    }).toString();

    const options = {
      hostname: 'api.cloudinary.com',
      path: `/v1_1/${cloudName}/image/context`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function generateSignature(publicId, context, timestamp, apiSecret) {
  const crypto = require('crypto');
  const toSign = `context=${context}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  return crypto.createHash('sha1').update(toSign).digest('hex');
}
