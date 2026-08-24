const { ApifyClient } = require('apify-client');

module.exports = async (req, res) => {
    // Hanya izinkan method POST dari frontend
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Mengambil token dari Environment Variable Vercel
        const client = new ApifyClient({
            token: process.env.APIFY_API_TOKEN, 
        });

        const input = { url: url };
        
        // Memanggil Actor apify
        const run = await client.actor("easyapi/all-in-one-media-downloader").call(input);
        
        // Mengambil hasil dari dataset
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        if (items && items.length > 0) {
            res.status(200).json(items[0]);
        } else {
            res.status(404).json({ error: 'Media tidak ditemukan.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};