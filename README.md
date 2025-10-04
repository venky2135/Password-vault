## Getting Started

### 1️⃣ Clone the repository


git clone [your-repo-url]
cd [repo-folder]
2️⃣ Install dependencies
bash

npm install

3️⃣ Run the development server

npm run dev


Note: The Turbopack icon in dev mode is normal. You can disable it in next.config.js with:

experimental: { turbo: { devOverlay: false } }
4️⃣ Build and run production

npm run build
npm run start
