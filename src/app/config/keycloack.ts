// src/config/keycloak.ts
export const keycloakConfig = {
  realm: 'blogio',
  'auth-server-url': 'http://localhost:8080',
  'ssl-required': 'external',
  resource: 'blogio-client',
  'public-client': true,
  'confidential-port': 0,
  clientId: 'blogio-client',
  clientSecret: 'your-client-secret', // untuk confidential client
};

export const keycloakAdminConfig = {
  baseUrl: 'http://localhost:8080',
  realmName: 'blogio',
  username: 'admin',
  password: 'admin123',
  grantType: 'password',
  clientId: 'admin-cli',
};