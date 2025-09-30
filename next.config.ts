import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.pinimg.com", "lh3.googleusercontent.com"], // add any other remote hosts you use
  },
};

export default nextConfig;
