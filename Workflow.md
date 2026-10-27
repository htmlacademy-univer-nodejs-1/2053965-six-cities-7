## Workflow

### Установка зависимостей

```bash
npm install
```

## Запуск приложения

Собрать проект и запустить CLI:

```bash
npm cli
```

Запуск CLI-команды через собранное приложение:

```bash
npm run cli -- --command <параметры>
```

### Mock-сервер

Запуск JSON-server:

```bash
npm run mock-server
```

Сервер использует `mocks/mock-server-data.json` и доступен по адресу:

```text
http://localhost:3000
```

### CLI-команды

Справка:

```bash
npm run cli -- --help
```

Версия:

```bash
npm run cli -- --version
```

Генерация тестовых данных:

```bash
npm run cli -- --generate <n> <filepath> <url>
```

Пример:

```bash
npm run cli -- --generate 10 ./generated/offers.tsv http://localhost:3123
```

Импорт TSV-файла:

```bash
npm run cli -- --import ./generated/offers.tsv
```

Генерация и импорт выполняются потоково: данные обрабатываются по одной записи и не загружаются целиком в память.
