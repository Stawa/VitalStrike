#!/usr/bin/env sh
set -e
cd "$(dirname "$0")/.."

./gradlew build "$@"

echo
echo "Built:"
ls build/libs/VitalStrike-*.jar
