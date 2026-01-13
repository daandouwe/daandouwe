const https = require('https');

// Delete an image from Cloudinary
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
    const { public_id } = JSON.parse(event.body);

    if (!public_id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'public_id is required' }),
      };
    }

    // Delete the image
    const result = await deleteCloudinaryImage(cloudName, apiKey, apiSecret, public_id);

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, result }),
    };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to delete image' }),
    };
  }
};

function deleteCloudinaryImage(cloudName, apiKey, apiSecret, publicId) {
  return new Promise((resolve, reject) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignature(publicId, timestamp, apiSecret);

    const postData = new URLSearchParams({
      public_id: publicId,
      timestamp: timestamp.toString(),
      api_key: apiKey,
      signature: signature,
    }).toString();

    const options = {
      hostname: 'api.cloudinary.com',
      path: `/v1_1/${cloudName}/image/destroy`,
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

function generateSignature(publicId, timestamp, apiSecret) {
  const crypto = require('crypto');
  const toSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  return crypto.createHash('sha1').update(toSign).digest('hex');
}
