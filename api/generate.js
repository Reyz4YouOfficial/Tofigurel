const multer = require('multer');
const axios = require('axios');

const upload = multer({ storage: multer.memoryStorage() }).single('image');

const runMiddleware = (req, res, fn) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) return reject(result);
            return resolve(result);
        });
    });
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    try {
        await runMiddleware(req, res, upload);
        const promptText = req.body.prompt;
        const imgBuffer = req.file.buffer;

        // --- MASUKKAN FUNGSI NANOEDIT ASLI ANDA DI SINI ---
        // Contoh: const resultUrl = await nanoEdit(imgBuffer, promptText);
        const resultUrl = "https://picsum.photos/1000/1000"; // Placeholder hasil AI

        const response = await axios.get(resultUrl, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(response.data).toString('base64');

        res.status(200).json({ 
            success: true, 
            url: `data:image/png;base64,${base64Image}` 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
