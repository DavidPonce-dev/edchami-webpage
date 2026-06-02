#!/bin/sh
set -e

# Ensure the upload directory exists with correct permissions
mkdir -p /app/storage/img/projects
chown -R nextjs:nodejs /app/storage/img

# Run database migrations before starting the app
npx drizzle-kit migrate --config=drizzle.config.ts 2>/dev/null || echo "Warning: Migration failed, continuing anyway"

# Execute the CMD as the nextjs user
exec su-exec nextjs "$@"
