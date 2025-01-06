const fs = require('fs');
const path = require('path');

// Define the source and destination paths
const sourcePath = path.resolve(__dirname, 'src', 'assets', 'avatars', 'default_avatar.png');
const destDir = path.resolve(__dirname, 'uploads', 'avatars');
const destPath = path.join(destDir, 'default_avatar.png');

// Ensure the destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy the file
fs.copyFileSync(sourcePath, destPath);

console.log(`Copied ${sourcePath} to ${destPath}`);