#!/bin/bash

# Script to install dependencies and run all tests

echo "===== Stealth Payload Test Runner ====="
echo "This script will install dependencies and run all tests"
echo

# Step 1: Fix TypeScript errors
echo "Step 1: Fixing TypeScript errors..."
chmod +x fix-typescript-errors.sh
./fix-typescript-errors.sh
echo

# Step 2: Install test dependencies
echo "Step 2: Installing test dependencies..."
cp test-package.json package.json
npm install
echo

# Step 3: Run the tests
echo "Step 3: Running tests..."
node run-tests.js
TEST_EXIT_CODE=$?

echo
if [ $TEST_EXIT_CODE -eq 0 ]; then
  echo "✅ All tests passed successfully!"
else
  echo "❌ Some tests failed. Check the output above for details."
fi

echo
echo "===== Testing Complete ====="
exit $TEST_EXIT_CODE