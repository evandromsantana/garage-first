---
description: Workflow para operações de banco de dados com Prisma
---

# Prisma Database Workflow

## 1. Verificar Schema

// turbo

```bash
npx prisma validate
```

## 2. Gerar Client (após mudanças no schema)

// turbo

```bash
npx prisma generate
```

## 3. Aplicar Migrations

// turbo

```bash
npx prisma migrate dev --name <nome-da-migration>
```

## 4. Visualizar Dados

// turbo

```bash
npx prisma studio
```

## 5. Seed Database

// turbo

```bash
npm run seed
```
