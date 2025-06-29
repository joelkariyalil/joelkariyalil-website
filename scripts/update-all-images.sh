#!/bin/bash

# Make scripts executable
chmod +x scripts/update-image-yaml.ts
chmod +x scripts/manage-content-images.ts

# Run the content image management script
echo "Managing content images..."
npx ts-node scripts/manage-content-images.ts

# Run the YAML update script
echo -e "\nUpdating images.yaml..."
npx ts-node scripts/update-image-yaml.ts

echo -e "\nAll done! 🎉" 