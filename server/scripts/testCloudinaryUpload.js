// One-off diagnostic script — NOT part of the app, safe to delete after use.
// Run from the server/ folder:   node scripts/testCloudinaryUpload.js
//
// It uploads a tiny public test image straight through the Cloudinary SDK,
// bypassing multer/Express entirely. This tells us whether the 403 is:
//   (a) a credentials problem (cloud_name / api_key / api_secret), or
//   (b) an account-level restriction (needs verification, security settings, plan limits)
//
// If this script ALSO fails with 403, the problem is 100% on the Cloudinary
// account/credentials side, not in this codebase.

import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

console.log('Using:');
console.log('  CLOUDINARY_CLOUD_NAME =', JSON.stringify(process.env.CLOUDINARY_CLOUD_NAME));
console.log('  CLOUDINARY_API_KEY    =', JSON.stringify(process.env.CLOUDINARY_API_KEY));
console.log('  CLOUDINARY_API_SECRET =', process.env.CLOUDINARY_API_SECRET ? '(set, hidden)' : '(MISSING)');
console.log('');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

try {
  const result = await cloudinary.uploader.upload(
    'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    { folder: 'bhopal-creators-summit/_diagnostic-test' }
  );
  console.log('SUCCESS — credentials and account are working fine.');
  console.log('Uploaded URL:', result.secure_url);
  console.log('\nThis means the problem is likely in the request coming from the browser/app');
  console.log('(e.g. the file itself, or something about that specific upload) rather than the account.');
} catch (err) {
  console.log('FAILED — full error object below:\n');
  console.dir(err, { depth: null });
  console.log('\nIf http_code is 403, check (in order):');
  console.log('1. Cloudinary dashboard homepage for any "verify your account" / restriction banner.');
  console.log('2. Settings -> Security -> make sure there is no restrictive "Allowed fetch domains" or IP allow-list turned on.');
  console.log('3. That this account is a "Programmable Media" product account, not "Media Optimizer" only.');
  console.log('4. That cloud_name/api_key/api_secret above exactly match your dashboard (no quotes, no trailing spaces).');
}

process.exit(0);