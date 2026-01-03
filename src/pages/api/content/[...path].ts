import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: urlPath } = req.query;
  
  if (!urlPath) {
    return res.status(400).json({ error: 'Path is required' });
  }

  // Ensure path is an array and join it
  const relativePath = Array.isArray(urlPath) ? urlPath.join('/') : urlPath;
  
  // Construct the absolute path, ensuring we stay within the content directory
  const contentDir = path.join(process.cwd(), 'content');
  const filePath = path.join(contentDir, relativePath);

  // Basic security check to prevent directory traversal
  if (!filePath.startsWith(contentDir)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      return res.status(400).json({ error: 'Not a file' });
    }

    // Determine content type
    const contentType = mime.lookup(filePath) || 'application/octet-stream';
    
    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    return fileStream.pipe(res);
  } catch (error) {
    console.error('Error serving file:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 