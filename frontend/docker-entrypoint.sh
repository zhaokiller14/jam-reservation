#!/bin/sh
set -e

# Substitute environment variables in nginx config
# Default to local backend if not specified and add a scheme when missing
BACKEND_URL="${BACKEND_URL:-http://backend:3000}"

case "$BACKEND_URL" in
  http://*|https://*) ;;
  *) BACKEND_URL="https://$BACKEND_URL" ;;
esac

export BACKEND_URL

# Create a temp file and substitute
envsubst "\$BACKEND_URL" < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g "daemon off;"
