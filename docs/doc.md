# 🏍️ Projeto Garage-First: Ninja 400
> **Status:** MVP - Sprint 1 Concluído  
> **Foco:** Gestão de Manutenção, Restauração e Telemetria Estática.

---

## 1. Visão Geral
O **Garage-First** é um sistema web mobile-first projetado para entusiastas DIY (Do It Yourself) e proprietários de motocicletas (especificamente a Kawasaki Ninja 400). O sistema permite o registro detalhado de intervenções mecânicas, controle de custos de peças e consulta rápida de especificações técnicas (torques e diagramas) em ambiente de oficina.

## 2. Stack Tecnológica
* **Framework:** Next.js 15 (App Router)
* **Linguagem:** TypeScript
* **Banco de Dados:** SQLite (Local/Arquivo)
* **ORM:** Prisma
* **UI/UX:** Tailwind CSS + Shadcn/UI
* **Arquitetura:** Server Actions para persistência de dados (Sem necessidade de API externa).

## 3. Arquitetura de Dados (Modelo de Entidade-Relacionamento)
O banco de dados foi modelado para suportar o histórico de manutenção acoplado ao custo financeiro:

### Entidades Principais:
* **Vehicle:** Armazena os dados da moto (Modelo, Ano, KM atual).
* **MaintenanceLog:** Registra o evento de manutenção (Tipo, Descrição, KM na hora do serviço).
* **ProjectExpense:** Detalha as peças ou insumos comprados para cada manutenção (Item, Custo, Origem).
* **TechnicalSpec:** Catálogo de consulta rápida para torques de aperto e códigos de microfichas (Ex: Eixo dianteiro -> 108 Nm).

## 4. Requisitos Funcionais (Backlog)

### Sprint 1: Core & Infra (Concluído ✅)
* [x] Setup do projeto Next.js 15.
* [x] Modelagem do banco de dados no Prisma.
* [x] Singleton de conexão com o banco.
* [x] Server Actions básicas de CRUD.

### Sprint 2: Dashboard & Entrada de Dados (Em progresso 🚧)
* [ ] Dashboard mobile-first com cards de status.
* [ ] Botão Flutuante (FAB) para inserção rápida.
* [ ] Drawer (Bottom Sheet) para registro de serviços sem troca de página.

### Sprint 3: Inteligência de Oficina
* [ ] Central de busca de torques (Command Palette).
* [ ] Visualizador de Microfichas (Diagramas originais).
* [ ] Alertas preventivos baseados em KM (Troca de óleo, fluido de freio).

## 5. Estrutura de Diretórios
```text
src/
├── app/              # Rotas e Páginas (Next.js App Router)
├── components/       # Componentes de UI (Shadcn + Custom)
│   ├── ui/           # Componentes base do Shadcn
│   └── garage/       # Componentes específicos do projeto
├── lib/              # Utilitários, Banco de Dados e Actions
│   ├── db.ts         # Singleton do Prisma
│   └── actions.ts    # Lógica de negócio (Server Actions)
├── types/            # Definições de tipos TypeScript
└── public/
    └── fichas/       # Imagens dos diagramas técnicos (.jpg/.png)
```

## 6. Procedimentos de Instalação (Dev)
1.  Clonar o repositório.
2.  Instalar dependências: `npm install`.
3.  Configurar variável de ambiente: `DATABASE_URL="file:./dev.db"`.
4.  Sincronizar banco: `npx prisma db push`.
5.  Rodar o servidor: `npm run dev`.

---

> **Nota do Desenvolvedor:** > O sistema foi otimizado para o "Modo Dark" para reduzir o ofuscamento em ambientes de oficina e economizar bateria em dispositivos móveis. As imagens de diagramas devem seguir o padrão de nomenclatura `diagramCode` definido no catálogo da Kawasaki.

