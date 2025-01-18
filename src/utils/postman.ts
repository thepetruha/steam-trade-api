import fs from 'fs';
import listEndpoints from 'express-list-endpoints';
import { Express } from 'express';
import path from 'path';
import Logger from './logger';

function generatePostmanCollection(endpoints: Array<{ path: string; methods: string[] }>) {
  return {
    info: {
      name: 'API Endpoints',
      description: 'Generated API Endpoints for Postman',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: endpoints.map((endpoint) => ({
      name: `${endpoint.path} [${endpoint.methods.join(', ')}]`,
      request: {
        method: endpoint.methods[0], // Учитываем только первый метод
        header: [],
        url: {
          raw: `{{base_url}}${endpoint.path}`,
          host: ['{{base_url}}'],
          path: endpoint.path.split('/').filter(Boolean),
        },
      },
    })),
  };
}

export default function exportEndpoints(app: Express, postmanPath: string) {
  const endpoints = listEndpoints(app);
  const postmanCollection = generatePostmanCollection(endpoints);

  const filePath = path.join(__dirname, postmanPath);
  fs.writeFileSync(filePath, JSON.stringify(postmanCollection, null, 2), 'utf-8');
  Logger("INFO", "POSTMAN", `Postman collection has been generated`);
}