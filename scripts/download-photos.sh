#!/bin/bash

# Create the clicks directory if it doesn't exist
mkdir -p public/images/clicks

# Download 30 images with consistent naming
for i in {1..30}
do
  # Using Unsplash Source API for better quality photos
  # Using a fixed size of 800x600 for consistency
  curl -L "https://source.unsplash.com/random/800x600?nature,photography&${i}" -o "public/images/clicks/${i}.jpg"
  echo "Downloaded image ${i}"
  # Add a small delay to avoid rate limiting
  sleep 0.5
done

echo "All images downloaded successfully!" 