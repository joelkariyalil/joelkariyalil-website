#!/bin/bash

# Function to create assets directory and download placeholder image
setup_blog_assets() {
  local blog_path="$1"
  local assets_dir="$blog_path/assets"
  
  # Create assets directory if it doesn't exist
  mkdir -p "$assets_dir"
  
  # Download placeholder image if cover.jpg doesn't exist
  if [ ! -f "$assets_dir/cover.jpg" ]; then
    echo "Downloading placeholder image for $blog_path"
    curl -L "https://picsum.photos/800/400" -o "$assets_dir/cover.jpg"
  fi
}

# List of blogs that need assets
BLOGS=(
  "content/blogs/aws-serverless-architecture"
  "content/blogs/building-microservices-with-nodejs"
  "content/blogs/css-grid-mastery"
  "content/blogs/machine-learning-javascript"
  "content/blogs/nextjs-performance-optimization"
  "content/blogs/react-performance-optimization"
  "content/blogs/tailwind-css-tips"
  "content/blogs/web-security-best-practices"
)

# Set up assets for each blog
for blog in "${BLOGS[@]}"; do
  setup_blog_assets "$blog"
done

# Special case for building-a-modern-nextjs-blog demo poster
demo_poster_dir="content/blogs/building-a-modern-nextjs-blog/assets"
if [ ! -f "$demo_poster_dir/demo-poster.jpg" ]; then
  echo "Downloading demo poster image"
  curl -L "https://picsum.photos/1280/720" -o "$demo_poster_dir/demo-poster.jpg"
fi

echo "Asset setup complete!" 