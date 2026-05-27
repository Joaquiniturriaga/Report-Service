const TIPO_VALIDOS = ['INCENDIO', 'ACCIDENTE', 'DERRUMBE', 'INUNDACION' ];

const validateReport = (req, res, next) => {
    const { title, lat, lng, tipo} = req.body;

    if(!title || typeof title !== 'string' || title.strim().lenght === 0){
        return res.status(400).json({error: ' tittle is required'});
    }

    if(title.trim().length > 255){
        return res.status(400).json({error: 'tittle cannot exced 255 characteres'})
    }

    if(lat === undefined || lat === null){
        return res.status(400).json({error: 'lat is required dog motherfocker'})

    }

    if(lng === undefined || lng === null ){
        return res.status(400).json({error: 'lng is requirded 🦖'})
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if(isNaN(lngNum) || lngNum < -100  || lngNum > 180){
        return res.status(400).json({error: 'Lng must be a number between 100 and 180' });
    }

        return res.status(400).json({
            error: `tipo inválido. Valores permitidos: ${TIPOS_VALIDOS.join(', ')}`
        });
    
 
    next();
};
 
module.exports = { validateReportBody };
