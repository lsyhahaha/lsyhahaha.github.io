#!/usr/bin/env bash

set -Eeuo pipefail

readonly PROJECT_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly HOMEBREW_RUBY_BIN="/opt/homebrew/opt/ruby/bin"

if [[ ! -x "${HOMEBREW_RUBY_BIN}/ruby" ]]; then
  printf 'Error: Homebrew Ruby was not found at %s\n' "${HOMEBREW_RUBY_BIN}" >&2
  exit 1
fi

export PATH="${HOMEBREW_RUBY_BIN}:${PATH}"

if ! command -v bundle >/dev/null 2>&1; then
  printf 'Error: Bundler is not available in the Homebrew Ruby environment.\n' >&2
  exit 1
fi

cd -- "${PROJECT_ROOT}"
exec bundle exec jekyll serve "$@"
