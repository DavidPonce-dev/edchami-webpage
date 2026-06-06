#!/bin/sh
set -e

# Ensure the upload directory exists with correct permissions
mkdir -p /app/storage/img/projects
chown -R nextjs:nodejs /app/storage/img

# Run database migrations before starting the app
echo "Running database migrations..."
npx drizzle-kit migrate --config=drizzle.config.ts
echo "Migrations complete."

# Execute the CMD as the nextjs user
exec su-exec nextjs "$@"
