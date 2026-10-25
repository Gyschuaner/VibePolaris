/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/library/posters/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }];
  },
  async redirects() {
    return ["/terms", "/graph"].map(source => ({ source, destination: "/", permanent: true }));
  },
};

export default nextConfig;
