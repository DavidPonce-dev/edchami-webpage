#!/bin/sh
set -e

# Ensure the upload directory exists with correct permissions
mkdir -p /app/public/img/projects
chown -R nextjs:nodejs /app/public/img

# Execute the CMD as the nextjs user
exec su-exec nextjs "$@"
