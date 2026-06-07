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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      // Clerk user profile images
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;