/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The kairos-tracker.js endpoint must be reachable cross-origin from client sites.
  async headers() {
    return [
      {
        source: "/api/track",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
};

export default nextConfig;
