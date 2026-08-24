#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export PATH="${HOME}/.local/bin:${PATH}"

if ! command -v graphify >/dev/null 2>&1; then
  echo "Installing graphifyy..."
  pip install --user graphifyy
  export PATH="${HOME}/.local/bin:${PATH}"
fi

cd "$ROOT"
MODE="${1:-build}"

case "$MODE" in
  build)
    graphify . --code-only
    graphify cluster-only .
    ;;
  update)
    graphify . --code-only
    graphify cluster-only .
    ;;
  query)
    shift
    graphify query "$@"
    ;;
  install-cursor)
    graphify cursor install
    ;;
  *)
    echo "Usage: $0 {build|update|query <question>|install-cursor}"
    exit 1
    ;;
esac
