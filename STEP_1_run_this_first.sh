#!/bin/bash
# ============================================================
# STEP 1 — Remove Firebase
# Run from the SparkFlow repo root
# ============================================================

echo "🗑  Uninstalling Firebase packages..."
npm uninstall firebase firebase-admin

echo "🗑  Removing src/firebase/ directory..."
rm -rf src/firebase

echo "🗑  Removing Firebase app hosting config..."
rm -f apphosting.yaml

echo "✅  Firebase removed. Now:"
echo "    1. Open src/app/layout.tsx"
echo "    2. Delete the <FirebaseClientProvider> wrapper"
echo "    3. Remove any 'import ... from src/firebase/...' lines"
echo ""
echo "    Then copy the files from STEP_2_supabase_packages.sh"
echo "    and run it to install Supabase."
