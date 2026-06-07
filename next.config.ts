// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   serverExternalPackages: [
//     "@prisma/client",
//     "@prisma/adapter-neon",
//     "@neondatabase/serverless",
//     "bcryptjs",
//     "razorpay",
//   ],
//   images: {
//     remotePatterns: [
//       { protocol: "https", hostname: "res.cloudinary.com" },
//       { protocol: "https", hostname: "lh3.googleusercontent.com" },
//       { protocol: "https", hostname: "avatars.githubusercontent.com" },
//       { protocol: "https", hostname: "images.unsplash.com" },
//     ],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-neon",
    "@neondatabase/serverless",
    "bcryptjs",
    "razorpay",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Ignore seed file during build
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "prisma/seed.ts"];
    }
    return config;
  },
};

export default nextConfig;