#!/bin/sh
set -e

# Ensure the upload directory exists with correct permissions
mkdir -p /app/storage/img/projects
chown -R nextjs:nodejs /app/storage/img

# Execute the CMD as the nextjs user
exec su-exec nextjs "$@"
