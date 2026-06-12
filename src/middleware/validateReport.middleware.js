const TIPOS_VALIDOS = ['INCENDIO', 'ACCIDENTE', 'DERRUMBE', 'INUNDACION'];

const validateReport = (req, res, next) => {
    const { title, lat, lng, tipo } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ error: 'title is required' });
    }

    if (title.trim().length > 255) {
        return res.status(400).json({ error: 'title cannot exceed 255 characters' });
    }

    if (lat === undefined || lat === null) {
        return res.status(400).json({ error: 'lat is required' });
    }

    if (lng === undefined || lng === null) {
        return res.status(400).json({ error: 'lng is required' });
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
        return res.status(400).json({ error: 'lat must be a number between -90 and 90' });
    }

    if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
        return res.status(400).json({ error: 'lng must be a number between -180 and 180' });
    }

    if (tipo && !TIPOS_VALIDOS.includes(tipo)) {
        return res.status(400).json({
            error: `tipo invalido. Valores permitidos: ${TIPOS_VALIDOS.join(', ')}`
        });
    }

    next();
};

module.exports = { validateReport };