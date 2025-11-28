const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist'), {
    maxAge: '1d', // Cache static files for 1 day in production
    etag: true,
}));

// Handle SPA routing - serve index.html for all routes
// Use middleware instead of wildcard route for Express 5 compatibility
app.use((req, res, next) => {
    // If the request is for a file (has extension), let it 404
    if (path.extname(req.path).length > 0) {
        return next();
    }

    // Otherwise, serve index.html
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Production server running on http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${path.join(__dirname, 'dist')}`);
    console.log(`\n✅ Application is ready!`);
    console.log(`   - Open: http://localhost:${PORT}`);
    console.log(`   - Mode: PRODUCTION`);
});
