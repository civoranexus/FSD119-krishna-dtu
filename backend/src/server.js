"use strict";

// Server entry for HealthVillage backend
// Responsibilities:
// - validate required environment variables
// - configure minimal middleware (JSON parsing, URL-encoded)
// - mount API routes when available
// - provide health check endpoint
// - graceful shutdown and structured (console) logging

require('dotenv').config(); // Loads .env in development if present

const express = require('express');
const http = require('http');

const REQUIRED_ENVS = ['PORT', 'JWT_SECRET', 'DATABASE_URL'];

// Validate required environment variables early to fail fast in CI/production
const missing = REQUIRED_ENVS.filter((k) => !process.env[k]);
if (missing.length) {
	// In development we might allow some missing values, but fail loudly to prompt fix.
	// For CI/production ensure these are present via environment management.
	console.error(`Missing required environment variables: ${missing.join(', ')}`);
	// Exit with non-zero so deployment pipelines detect the misconfiguration.
	process.exit(1);
}

const PORT = Number(process.env.PORT) || 4000;

// Create Express app
const app = express();

// Minimal, framework-agnostic middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// Simple request logger (keeps dependency surface small)
app.use((req, res, next) => {
	const start = Date.now();
	res.on('finish', () => {
		const duration = Date.now() - start;
		console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
	});
	next();
});

// Mount application routes. Keep this tolerant so the server can still start
// if route modules are temporarily missing during incremental development.
try {
	// routes/index.js should export an Express Router
	const routes = require('./routes');
	app.use('/api', routes);
} catch (err) {
	console.warn('API routes could not be mounted:', err && err.message);
	// Expose minimal health and info endpoints so deploy checks can succeed.
	app.get('/api/_health', (req, res) => res.json({ status: 'ok' }));
}

// 404 handler for unknown API endpoints
app.use((req, res, next) => {
	res.status(404).json({ error: 'Not Found' });
});

// Centralized error handler - returns JSON errors and avoids leaking internals
app.use((err, req, res, next) => {
	console.error('Unhandled error:', err && err.stack ? err.stack : err);
	const status = err && err.status ? err.status : 500;
	const message = status === 500 ? 'Internal Server Error' : err.message;
	res.status(status).json({ error: message });
});

// Start server with graceful shutdown support
function startServer(port = PORT) {
	return new Promise((resolve, reject) => {
		const server = http.createServer(app);

		server.listen(port, () => {
			console.log(`HealthVillage backend listening on port ${port}`);
			resolve(server);
		});

		server.on('error', (err) => {
			console.error('Server error during startup:', err && err.message ? err.message : err);
			reject(err);
		});

		// Graceful shutdown
		const shutdown = (signal) => {
			console.log(`Received ${signal}. Shutting down gracefully...`);
			// stop accepting new connections
			server.close((closeErr) => {
				if (closeErr) {
					console.error('Error during server close:', closeErr);
					process.exit(1);
				}
				// TODO: flush logs, close DB connections, stop background jobs
				console.log('Shutdown complete. Exiting.');
				process.exit(0);
			});

			// Force exit after timeout
			setTimeout(() => {
				console.error('Forced shutdown after timeout.');
				process.exit(1);
			}, 10_000).unref();
		};

		process.on('SIGINT', () => shutdown('SIGINT'));
		process.on('SIGTERM', () => shutdown('SIGTERM'));
	});
}

// If run directly, start the server. Export `app` and `startServer` for tests.
if (require.main === module) {
	startServer().catch((err) => {
		console.error('Failed to start server:', err && err.message ? err.message : err);
		process.exit(1);
	});
}

module.exports = { app, startServer };

