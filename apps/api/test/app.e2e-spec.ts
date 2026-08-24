import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ORGANIZATION_HEADER } from '../src/common/decorators/auth.decorators';

describe('OpsHub API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let organizationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers a user and organization', async () => {
    const email = `test-${Date.now()}@opshub.local`;
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email,
        password: 'password123',
        firstName: 'Mario',
        lastName: 'Rossi',
        organizationName: 'Test SRL',
      })
      .expect(201);

    expect(res.body.accessToken).toBeDefined();
    expect(res.body.organization.name).toBe('Test SRL');
    accessToken = res.body.accessToken;
    organizationId = res.body.organization.id;
  });

  it('creates a customer', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/customers')
      .set('Authorization', `Bearer ${accessToken}`)
      .set(ORGANIZATION_HEADER, organizationId)
      .send({ name: 'Cliente Demo', email: 'cliente@demo.it' })
      .expect(201);

    expect(res.body.name).toBe('Cliente Demo');
  });

  it('returns dashboard KPIs', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/reports/dashboard')
      .set('Authorization', `Bearer ${accessToken}`)
      .set(ORGANIZATION_HEADER, organizationId)
      .expect(200);

    expect(res.body.kpis).toBeDefined();
    expect(res.body.kpis.totalCustomers).toBeGreaterThanOrEqual(1);
  });
});
