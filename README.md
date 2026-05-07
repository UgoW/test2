<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## BACK-JARDIN-MAGIQUE - API NestJS SQLite

API de démonstration NestJS avec TypeORM, SQLite, @nestjs/config et validation DTO.

### Arborescence principale

- `src/app.module.ts` : module racine, configuration TypeORM et imports de modules métiers
- `src/main.ts` : bootstrap de l'application, validation globale et logging
- `src/config/` : module de configuration et chargement `.env`
- `src/users/` : module métier User avec entité, service, contrôleur et DTOs
- `.env` : paramètres d'environnement

### Technologies

- NestJS
- TypeScript
- TypeORM
- SQLite
- @nestjs/config
- class-validator / class-transformer
- Podman pour le volume SQLite

### Installation

```bash
npm install
```

### Lancer en développement

```bash
npm run start:dev
```

### API Users

- `POST /users` : créer un utilisateur
- `GET /users` : récupérer tous les utilisateurs
- `GET /users/:id` : récupérer un utilisateur par id
- `PATCH /users/:id` : mettre à jour un utilisateur
- `DELETE /users/:id` : supprimer un utilisateur

### Exemple `.env`

```env
NODE_ENV=development
PORT=3000
DATABASE_PATH=/data/db.sqlite
```

### Exemple de commande Podman

```bash
podman run --rm -p 3000:3000 -v $(pwd)/data:/data -w /app node:20-alpine sh -c "npm install && npm run start:dev"
```

> Le fichier SQLite est monté en volume sur `/data/db.sqlite`.

### Exemple de lancement avec volume monté

- Créez un dossier `data/` à la racine du projet
- Montez ce dossier dans le conteneur Podman sur `/data`
- Définissez `DATABASE_PATH=/data/db.sqlite`

### Bonnes pratiques implémentées

- architecture modulaire (`users` module)
- séparation entités / DTOs
- validation globale et DTO
- exceptions NestJS propres
- repository TypeORM
- logs dans service et contrôleur
- `autoLoadEntities: true`
- `synchronize` uniquement hors production

### Commandes utiles

```bash
npm run build
npm run start:dev
npm run start:prod
npm run podman:run
```

## Dashboard Plantes API (v2)

### Modules backend

- `src/plants/` : CRUD plantes, filtres/pagination, export et endpoint sync
- `src/dashboard/` : agrégation KPI/alertes/zones/sync global pour le dashboard
- `src/reports/` : génération du rapport CSV
- `src/sync/` : logique de synchronisation `lastSync`
- `src/common/` : normalisation des réponses succès/erreur

### Endpoints livrés

- `GET /dashboard/overview`
- `GET /plants?status=&location=&search=&page=&limit=`
- `POST /plants`
- `POST /plants/sync`
- `GET /plants/export`
- `GET /plants/:id`
- `GET /locations`
- `POST /locations`
- `GET /locations/:id/plants`

Le `POST /plants` attend maintenant un `locationId` existant du user, ce qui permet au front de proposer une liste de localisations avant l'ajout d'une plante.

Tous ces endpoints sont protégés par JWT (`Authorization: Bearer <token>`), sauf `auth/register` et `auth/login`.

### Format de réponse

Succès:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-04-20T10:00:00.000Z"
  }
}
```

Erreur:

```json
{
  "success": false,
  "message": "Validation failed",
  "code": 400,
  "details": ["status must be a valid enum value"]
}
```

### Exemple `GET /dashboard/overview`

```json
{
  "success": true,
  "data": {
    "kpis": {
      "totalPlants": 4,
      "okPlants": 2,
      "attentionPlants": 1,
      "criticalPlants": 1,
      "avgHealthPercent": 63
    },
    "alerts": [
      {
        "plantId": "...",
        "plantName": "Calathea bureau",
        "status": "attention",
        "location": "Bureau",
        "reasons": ["humidite_basse", "lumiere_insuffisante"],
        "lastSync": "2026-04-20T10:10:00.000Z"
      }
    ],
    "zones": [
      {
        "zoneName": "Salon",
        "total": 2,
        "okCount": 2,
        "attentionCount": 0,
        "criticalCount": 0,
        "globalStatus": "ok"
      }
    ],
    "lastSync": {
      "lastSyncGlobal": "2026-04-20T10:20:00.000Z",
      "statusSync": "ok",
      "minutesElapsed": 4
    },
    "quickActions": [
      { "id": "add-plant", "label": "Add plant", "enabled": true },
      { "id": "sync-now", "label": "Sync now", "enabled": true },
      { "id": "export-report", "label": "Export report", "enabled": true }
    ]
  }
}
```

### Exemple `GET /plants`

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Ficus du salon",
      "status": "ok",
      "humidity": 58,
      "light": 520,
      "temperature": 22,
      "location": "Salon",
      "lastSync": "2026-04-20T10:20:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 4,
    "totalPages": 1,
    "timestamp": "2026-04-20T10:20:00.000Z"
  }
}
```

### Exemple `GET /plants/export`

```json
{
  "success": true,
  "data": {
    "format": "csv",
    "filename": "plants-report-2026-04-20T10:20:00.000Z.csv",
    "content": "id,name,status,humidity,light,temperature,location,lastSync\n\"...\",\"Ficus du salon\",\"ok\",\"58\",\"520\",\"22\",\"Salon\",\"2026-04-20T10:20:00.000Z\"",
    "total": 4
  }
}
```

### Donnees de test (seeds)

- Fixture e2e: `test/fixtures/plants.seed.ts`
- Couverture multi-zones et multi-statuts (`ok`, `attention`, `critical`)

### Tests

- Unitaires dashboard: `src/dashboard/dashboard-metrics.service.spec.ts`
- E2E dashboard/actions rapides: `test/app.e2e-spec.ts`

Commandes:

```bash
npm run test -- --runInBand
npm run test:e2e -- --runInBand
```
