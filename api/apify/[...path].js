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

    // Health check endpoint
    if (req.query.path && req.query.path[0] === 'health') {
        res.status(200).json({
            status: 'ok',
            message: 'Apify proxy is working',
            timestamp: new Date().toISOString()
        });
        return;
    }

    try {
        // Log the incoming request for debugging
        console.log('Incoming request:', {
            method: req.method,
            query: req.query,
            headers: Object.keys(req.headers),
            hasAuth: !!req.headers.authorization
        });

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

        // Prepare headers
        const headers = {
            'User-Agent': 'Apify-Actor-Playground/1.0',
        };

        // Add authorization header if present
        if (req.headers.authorization) {
            headers['Authorization'] = req.headers.authorization;
        }

        // Add content-type for POST requests
        if (req.method !== 'GET' && req.body) {
            headers['Content-Type'] = 'application/json';
        }

        // Forward the request to Apify API
        const response = await fetch(targetUrl, {
            method: req.method,
            headers,
            body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined,
        });

        // Check if response is ok
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error ${response.status}:`, errorText);
            return res.status(response.status).json({
                error: `API request failed with status ${response.status}`,
                message: errorText
            });
        }

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