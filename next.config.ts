import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: false,
	experimental: {
		serverActions: {
			bodySizeLimit: "10mb",
		},
	},
	images: {
		domains: ["aqrkyqfmgegqetneuksb.supabase.co"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.supabase.co",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
