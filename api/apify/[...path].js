// Vercel serverless function to proxy Apify API requests
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Prevent caching for API responses to avoid stale data
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Extract the path from the dynamic route
        const { path, ...queryParams } = req.query;
        const apiPath = Array.isArray(path) ? path.join('/') : path || '';

        // Build query string from remaining parameters
        const queryString = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => queryString.append(key, v));
            } else if (value) {
                queryString.append(key, value);
            }
        });

        // Build the target URL
        const targetUrl = `https://api.apify.com/v2/${apiPath}${queryString.toString() ? '?' + queryString.toString() : ''}`;

        console.log(`🔄 Proxying ${req.method} ${targetUrl}`);

        // Forward the request to Apify API
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'Authorization': req.headers.authorization,
                'Content-Type': 'application/json',
                'User-Agent': 'Apify-Actor-Playground/1.0',
            },
            body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined,
        });

        // Get response data
        const data = await response.json();

        // Forward the response
        res.status(response.status).json(data);

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({
            error: 'Proxy request failed',
            message: error.message
        });
    }
}