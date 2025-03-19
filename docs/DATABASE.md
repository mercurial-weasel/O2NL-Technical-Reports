
## Setting up access to Supabase data

```
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;
```

## 🚀 Summary: When to Use Each Command

| **Command** | **Purpose** | **When to Use?** |
|-------------|------------|-----------------|
| **`prisma:merge`** | Merges multiple Prisma schema files. | If your project splits Prisma models into different files. |
| **`prisma:migrate`** | Merges schema + applies a migration. | When adding new tables/fields during development. |
| **`prisma:generate`** | Merges schema + regenerates Prisma Client. | After updating `schema.prisma`. |
| **`prisma:push`** | Pushes schema changes **without migrations**. | Quick updates in early dev (⚠️ **Not for production**). |
| **`prisma:migrate:dev`** | Applies migrations in **development**. | When working locally. |
| **`prisma:migrate:deploy`** | Deploys migrations to **production**. | When deploying changes to staging/production. |
| **`prisma:deploy`** | Runs a **custom deploy script**. | When using a custom DB setup. |
| **`prisma:deploy:seed`** | Deploys + seeds the database. | When you need to populate initial data. |
| **`prisma:studio`** | Opens Prisma's GUI for DB management. | When you need to view or edit database records. |

---

## 🔥 Recommended Workflow

### 1️⃣ **When developing locally:**
```sh
npm run prisma:migrate
npm run prisma:generate
```

### 2️⃣ **When making quick schema updates (not recommended for production)**
```sh
npm run prisma:push
```


### 3️⃣ **When deploying to production:**
```sh
npm run prisma:migrate:deploy
npm run prisma:deploy:seed
```

### 4️⃣ To inspect or edit data:
```sh
npm run prisma:studio
```
