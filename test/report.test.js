// test/report.test.js
process.env.INTERNAL_SECRET = 'test-secret-123';

const request = require('supertest');
const app     = require('../app');

jest.mock('../src/services/report.service', () => ({
    createReport:       jest.fn().mockResolvedValue({ id: 1, title: 'Fire', status: 'ACTIVE' }),
    getReports:         jest.fn().mockResolvedValue([]),
    updateReportStatus: jest.fn().mockResolvedValue({ id: 1, status: 'CONTROLLED' }),
}));

const SECRET = process.env.INTERNAL_SECRET;
const BASE   = '/api/reports';

const AUTH = {
    'x-internal-key': SECRET,
    'x-user-id':      '1',
    'x-user-role':    'user',
};

const VALID_REPORT = {
    title: 'Incendio en cerro',
    lat:   -33.4569,
    lng:   -70.6483,
    tipo:  'INCENDIO',
};

// ── validateInternalSecret ────────────────────────────────────────────────────

describe('validateInternalSecret', () => {

    test('POST sin x-internal-key → 401', async () => {
        const res = await request(app).post(BASE).send(VALID_REPORT);
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('Unauthorized');
    });

    test('GET sin x-internal-key → 401', async () => {
        const res = await request(app).get(BASE);
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('Unauthorized');
    });

    test('x-internal-key incorrecta → 401', async () => {
        const res = await request(app).get(BASE).set('x-internal-key', 'clave-incorrecta');
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('Unauthorized');
    });
});

// ── validateToken ─────────────────────────────────────────────────────────────

describe('validateToken', () => {

    test('POST sin x-user-id → 401', async () => {
        const res = await request(app)
            .post(BASE)
            .set('x-internal-key', SECRET);
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('Token required');
    });

    test('GET sin x-user-id → 401', async () => {
        const res = await request(app)
            .get(BASE)
            .set('x-internal-key', SECRET);
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('Token required');
    });
});

// ── validateReport ────────────────────────────────────────────────────────────

describe('validateReport - POST /reports', () => {

    test('sin title → 400', async () => {
        const res = await request(app)
            .post(BASE).set(AUTH)
            .send({ lat: -33.4, lng: -70.6 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('title is required');
    });

    test('title vacío → 400', async () => {
        const res = await request(app)
            .post(BASE).set(AUTH)
            .send({ title: '   ', lat: -33.4, lng: -70.6 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('title is required');
    });

    test('title > 255 chars → 400', async () => {
        const res = await request(app)
            .post(BASE).set(AUTH)
            .send({ title: 'a'.repeat(256), lat: -33.4, lng: -70.6 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('title cannot exceed 255 characters');
    });

    test('sin lat → 400', async () => {
        const res = await request(app)
            .post(BASE).set(AUTH)
            .send({ title: 'Incendio', lng: -70.6 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('lat is required');
    });

    test('sin lng → 400', async () => {
        const res = await request(app)
            .post(BASE).set(AUTH)
            .send({ title: 'Incendio', lat: -33.4 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('lng is required');
    });

    test('lat fuera de rango → 400', async () => {
        const res = await request(app)
            .post(BASE).set(AUTH)
            .send({ title: 'Incendio', lat: 95, lng: -70.6 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('lat must be a number between -90 and 90');
    });

    test('lng fuera de rango → 400', async () => {
        const res = await request(app)
            .post(BASE).set(AUTH)
            .send({ title: 'Incendio', lat: -33.4, lng: 200 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('lng must be a number between -180 and 180');
    });

    test('tipo inválido → 400', async () => {
        const res = await request(app)
            .post(BASE).set(AUTH)
            .send({ ...VALID_REPORT, tipo: 'TERREMOTO' });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch('tipo invalido');
    });

    test('reporte válido → 201', async () => {
        const res = await request(app)
            .post(BASE).set(AUTH)
            .send(VALID_REPORT);
        expect(res.statusCode).toBe(201);
    });
});

// ── updateReportStatus (validación en el controller) ─────────────────────────

describe('PUT /reports/:id/status', () => {

    test('status inválido → 400', async () => {
        const res = await request(app)
            .put(`${BASE}/1/status`).set(AUTH)
            .send({ status: 'INVENTADO' });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch('Invalid status');
    });

    test('status válido → 200', async () => {
        const res = await request(app)
            .put(`${BASE}/1/status`).set(AUTH)
            .send({ status: 'CONTROLLED' });
        expect(res.statusCode).toBe(200);
    });

    test('report no encontrado → 404', async () => {
        const reportService = require('../src/services/report.service');
        reportService.updateReportStatus.mockResolvedValueOnce(null);

        const res = await request(app)
            .put(`${BASE}/999/status`).set(AUTH)
            .send({ status: 'CONTROLLED' });
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Report not found');
    });
});

// ── endpoint interno ──────────────────────────────────────────────────────────

describe('PUT /reports/internal/:id/status', () => {

    test('sin x-internal-key → 401', async () => {
        const res = await request(app)
            .put(`${BASE}/internal/1/status`)
            .send({ status: 'CONTROLLED' });
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('Unauthorized');
    });

    test('con x-internal-key válido, sin x-user-id → 200', async () => {
        // El endpoint interno no requiere validateToken, solo el secret
        const res = await request(app)
            .put(`${BASE}/internal/1/status`)
            .set('x-internal-key', SECRET)
            .send({ status: 'CONTROLLED' });
        expect(res.statusCode).toBe(200);
    });
});