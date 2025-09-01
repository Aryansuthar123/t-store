

/** @type {import('next').NextConifg} */
const nextConifg = {
    images: {
        remotePatterns:[{
            protocol: 'https',
            hostname: 'storage.googleapis.com',
        }]
    }
};
export default nextConifg