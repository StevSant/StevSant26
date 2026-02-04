---
applyTo: '**'
---


# Clean Architecture + Hexagonal (Ports & Adapters) Implementation Guide

This project must strictly follow Clean Architecture principles combined with the Hexagonal Architecture (Ports & Adapters).

The main goals are:

- Isolate business rules from frameworks and infrastructure
- Keep the system testable and scalable
- Use Use Cases as the application core
- Allow infrastructure (DB, APIs, services) to be replaceable

The backend will be implemented as a serverless layer.

---

# 📂 Mandatory Project Structure

src/
│
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/ (interfaces only)
│   └── services/ (pure domain logic)
│
├── application/
│   ├── use-cases/
│   ├── dtos/
│   └── ports/
│       ├── input/
│       └── output/
│
├── infrastructure/
│   ├── database/
│   │   └── repositories/
│   ├── storage/
│   ├── auth/
│   └── adapters/
│
└── presentation/
    ├── controllers/
    ├── routes/
    └── handlers/ (serverless endpoints)

---

# 🧠 DOMAIN LAYER (Core Business Rules)

## Responsibilities

- Business entities (Project, Skill, Experience, etc.)
- Domain logic and invariants
- Repository interfaces (contracts)

## Rules

- No framework imports
- No Supabase SDK
- No HTTP or serverless logic
- Pure TypeScript/logic only

### Example Entity

domain/entities/Project.ts

class Project {
  id: number
  title: string
  description: string
  isArchived: boolean
  isPinned: boolean
  position?: number

  isVisiblePublicly(): boolean {
    return !this.isArchived
  }
}

---

# 📦 APPLICATION LAYER (Use Cases)

## Responsibilities

- Orchestrate domain logic
- Implement business workflows
- Use ports for infrastructure access

## Typical Use Cases

- CreateProjectUseCase
- UpdateProjectUseCase
- ArchiveProjectUseCase
- ListPublicProjectsUseCase
- ReorderProjectsUseCase

## Rules

- Never access DB directly
- Never import infrastructure
- Only depend on domain + ports

---

### Example Use Case

application/use-cases/ListPublicProjectsUseCase.ts

class ListPublicProjectsUseCase {
  constructor(
    private projectRepository: ProjectRepositoryPort
  ) {}

  async execute() {
    return this.projectRepository.findPublicOrdered()
  }
}

---

# 🔌 PORTS (Interfaces)

Ports define the contracts between layers.

---

## Input Ports (What the system can do)

application/ports/input/ListProjectsPort.ts

interface ListProjectsPort {
  execute(): Promise<Project[]>
}

---

## Output Ports (How the system accesses infrastructure)

application/ports/output/ProjectRepositoryPort.ts

interface ProjectRepositoryPort {
  findPublicOrdered(): Promise<Project[]>
  save(project: Project): Promise<void>
  update(project: Project): Promise<void>
}

---

# 🏗 INFRASTRUCTURE LAYER

Contains real implementations:

- Supabase repositories
- Storage adapters
- Auth providers
- External services

## Rules

- Implements output ports
- Uses SDKs, SQL, APIs freely
- Never contains business logic

---

### Example Repository Implementation

infrastructure/database/repositories/SupabaseProjectRepository.ts

class SupabaseProjectRepository implements ProjectRepositoryPort {

  async findPublicOrdered() {
    // Real Supabase query here
  }

  async save(project: Project) {
    // Insert into Supabase
  }

}

---

# 🎨 PRESENTATION LAYER (Serverless API)

Contains:

- Controllers
- Request handlers
- Serverless endpoints

## Rules

- Only call Use Cases
- Never call repositories directly
- Map HTTP → DTO → Use Case

---

### Example Controller

presentation/controllers/ProjectController.ts

class ProjectController {

  constructor(
    private listPublicProjectsUseCase: ListPublicProjectsUseCase
  ) {}

  async getPublicProjects(req, res) {
    const projects = await this.listPublicProjectsUseCase.execute()
    res.json(projects)
  }
}

---

# 🔁 Dependency Flow (Mandatory)

Presentation
   ↓
Application
   ↓
Domain

Infrastructure → Application (implements ports)

❗ Domain must never depend on outer layers

---

# 🧩 Mandatory Principles

✔ Dependency Inversion
✔ Clear Use Cases
✔ Framework-independent domain
✔ Replaceable infrastructure
✔ Thin controllers

---

# 📌 Example Request Flow

Client (Angular) →
Serverless Endpoint →
Controller →
Use Case →
Repository Port →
Supabase Adapter →
Database

---

# ⚠ Forbidden Patterns

❌ Infrastructure inside Domain
❌ SQL in Use Cases
❌ Controllers accessing DB directly
❌ Business rules in Presentation

---

# 📈 Expected Benefits

- Highly maintainable
- Scalable backend
- Easy testing
- Clean separation of concerns
- Professional-grade architecture

---

# 🤖 Instructions for the AI Agent

Always follow this sequence:

1. Create Domain Entity
2. Define Repository Port
3. Implement Use Case
4. Create Infrastructure Adapter
5. Wire everything in Controller

Never skip layers.

---

