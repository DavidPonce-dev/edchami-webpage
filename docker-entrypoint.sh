#!/bin/sh
set -e

echo "=== Container starting ==="

# Ensure the upload directory exists with correct permissions
mkdir -p /app/storage/img/projects
chown -R nextjs:nodejs /app/storage/img
echo "Storage directory ready."

# Run database migrations before starting the app
echo "Running database migrations..."
node --experimental-strip-types scripts/migrate.ts
echo "Migrations complete."

# Execute the CMD as the nextjs user
echo "Starting server..."
exec su-exec nextjs "$@"
