#!/bin/bash
echo "Cleaning Next.js cache..."
rm -rf .next
echo ""
echo "Starting development server..."
npm run dev
