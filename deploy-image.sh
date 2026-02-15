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
PLATFORM="${PLATFORM:-linux/amd64}"
TAR_NAME="${TAR_NAME:-${IMAGE_NAME}-${IMAGE_TAG}.tar}"
REMOTE_DIR="${REMOTE_DIR:-/root}"
CONTAINER_NAME="${CONTAINER_NAME:-ai-blog}"
HOST_PORT="${HOST_PORT:-3000}"
CONTAINER_PORT="${CONTAINER_PORT:-3000}"

echo "==> Building image: ${IMAGE_NAME}:${IMAGE_TAG} (${PLATFORM})"
docker build --platform "${PLATFORM}" -t "${IMAGE_NAME}:${IMAGE_TAG}" .

echo "==> Saving image to ${TAR_NAME}"
docker save -o "${TAR_NAME}" "${IMAGE_NAME}:${IMAGE_TAG}"

echo "==> Uploading ${TAR_NAME} to ${ECS_USER}@${ECS_HOST}:${REMOTE_DIR}"
scp "${TAR_NAME}" "${ECS_USER}@${ECS_HOST}:${REMOTE_DIR}/"

echo "==> Loading image and restarting container on ECS"
ssh "${ECS_USER}@${ECS_HOST}" "set -euo pipefail; \
docker load -i '${REMOTE_DIR}/${TAR_NAME}'; \
if docker ps -a --format '{{.Names}}' | grep -Fxq '${CONTAINER_NAME}'; then docker rm -f '${CONTAINER_NAME}'; fi; \
docker run -d --name '${CONTAINER_NAME}' -p ${HOST_PORT}:${CONTAINER_PORT} --restart always '${IMAGE_NAME}:${IMAGE_TAG}'"

echo "==> Done."
