#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./deploy-image.sh <ecs_host> [ecs_user]
# Example:
#   ./deploy-image.sh 1.2.3.4 root

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <ecs_host> [ecs_user]"
  exit 1
fi

ECS_HOST="$1"
ECS_USER="${2:-root}"

IMAGE_NAME="${IMAGE_NAME:-ai-blog}"
IMAGE_TAG="${IMAGE_TAG:-prod}"
PLATFORM="linux/amd64"
TAR_NAME="${TAR_NAME:-${IMAGE_NAME}-${IMAGE_TAG}.tar}"
REMOTE_DIR="${REMOTE_DIR:-/root/ai_blog}"

echo "==> Building image: ${IMAGE_NAME}:${IMAGE_TAG} (${PLATFORM})"
docker build --platform "${PLATFORM}" -t "${IMAGE_NAME}:${IMAGE_TAG}" .

echo "==> Saving image to ${TAR_NAME}"
docker save -o "${TAR_NAME}" "${IMAGE_NAME}:${IMAGE_TAG}"

echo "==> Uploading ${TAR_NAME} to ${ECS_USER}@${ECS_HOST}:${REMOTE_DIR}"
scp "${TAR_NAME}" "${ECS_USER}@${ECS_HOST}:${REMOTE_DIR}/"
scp "docker-compose.yml" "${ECS_USER}@${ECS_HOST}:${REMOTE_DIR}/docker-compose.yml"
scp "nginx/nginx.conf" "${ECS_USER}@${ECS_HOST}:${REMOTE_DIR}/nginx.conf"

echo "==> Loading image and starting services with docker compose on ECS"
ssh "${ECS_USER}@${ECS_HOST}" "set -euo pipefail; \
docker load -i '${REMOTE_DIR}/${TAR_NAME}'; \
mkdir -p '${REMOTE_DIR}/nginx'; \
mv -f '${REMOTE_DIR}/nginx.conf' '${REMOTE_DIR}/nginx/nginx.conf'; \
cd '${REMOTE_DIR}'; \
docker compose up -d"

echo "==> Done."
