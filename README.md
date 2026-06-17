# LogiControl

LogiControl — простое дипломное web-приложение для учета логистической деятельности производственного предприятия. Система позволяет вести справочники продукции, складов, поставщиков, клиентов и транспорта, а также регистрировать поставки, отгрузки и контролировать остатки продукции по складам.

## Стек

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite
- lucide-react
- bcryptjs для хеширования пароля администратора

## Структура проекта

- `app/` — страницы приложения, защищенная зона, login/logout и server actions.
- `components/` — общая оболочка, элементы интерфейса, формы и таблицы.
- `lib/` — Prisma client, авторизация, cookie-сессия, форматирование и логика остатков.
- `prisma/` — схема базы данных, миграции и seed-файл.

## Страницы

- `/login` — вход администратора.
- `/` — главная панель Dashboard.
- `/products` — продукция.
- `/warehouses` — склады.
- `/suppliers` — поставщики.
- `/customers` — клиенты.
- `/vehicles` — транспорт.
- `/supplies` — поставки.
- `/shipments` — отгрузки.
- `/stocks` — остатки продукции по складам.

## Модели базы данных

- `User`
- `Product`
- `Warehouse`
- `Supplier`
- `Customer`
- `Vehicle`
- `Supply`
- `Shipment`
- `Stock`

## Авторизация

Авторизация реализована вручную без NextAuth и внешних сервисов. После входа создается `httpOnly` cookie `logicontrol_session`, подписанная через `SESSION_SECRET`.

Тестовый администратор:

- логин: `admin`
- пароль: `admin123`

## Seed-данные

Seed создает администратора, тестовую продукцию, склады, поставщиков, клиентов, транспорт, стартовые остатки, поставки и отгрузки для демонстрации Dashboard и основных сценариев.

## Запуск проекта

Создайте `.env` по примеру `.env.example`:

```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="dev-secret-change-me"
```

Установите зависимости и подготовьте базу данных:

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

После запуска откройте:

```text
http://localhost:3000
```

## Проверка сборки

```bash
npm run build
```
