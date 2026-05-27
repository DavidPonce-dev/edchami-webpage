#!/bin/sh
set -e

echo "Waiting for database to be ready..."

MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if pg_isready -h "${DB_HOST:-db}" -p "${DB_PORT:-5432}" -U "${DB_USER:-postgres}" 2>/dev/null; then
    echo "Database is ready. Running migrations..."
    npx ts-node --project tsconfig.migrations.json -r tsconfig-paths/register node_modules/typeorm/cli.js migration:run -d typeorm.config.ts
    echo "Migrations completed successfully."
    exit 0
  fi

  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo "Database not ready yet (attempt $RETRY_COUNT/$MAX_RETRIES). Retrying in 2s..."
  sleep 2
done

echo "ERROR: Database did not become ready after $MAX_RETRIES attempts."
exit 1
