One exution for all that adds all tables + scrapes adds procedures

# DB Assignment 1

## Table of content

- [About](#about)
- [How to run](#how-to-run)
- [API Docs](#api-docs)

## About

Group E:

- Andreas Fritzbøger
- Owais Dashti
- Rasmus Taul

Our plan involves developing a simple server where the developer can access our server,
which in turn interacts with the underlying database layer through various procedures
corresponding to our 10 relevant questions to the given datasets ([found here](https://github.com/SoftDev2425/DB_Assignment_01/tree/master/src/scraper/data)).
<br>
Explain a lot here......

![ER-diagram](https://github.com/SoftDev2425/DB_Assignment_01/blob/master/imgs/ER_diagram_LATEST.png)

## How to run

### Step 1: Clone the project

```
git clone https://github.com/SoftDev2425/DB_Assignment_01.git
```

### Step 2: Install dependencies

Open the project in a terminal and run:

```
npm install
```

### Step 3: Configure DB-connection

1. Create a new database
2. Under the folder `src/utils/db` change the name of the file `dbConnection.template.ts` to `dbConnection.ts` and apply your own database configuration (we are well aware that .env is a better solution, but they can't be loaded when running ts-node in the following way).
   Add the following values to the `mssqlConfig`-object:
   - **database** (database name)
   - **user** (database username)
   - **password** (database password)

### Step 4: Run database scripts + add data

1. Firstly execute the `table.sql` script found [HERE](https://github.com/SoftDev2425/DB_Assignment_01/blob/master/sql/tables.sql) in your own database.

2. Secondly, to add data to the database, open a new terminal, navigate to `src/scraper`and run

```
npx ts-node index.ts
```

This will read the data from all .csv-files and add them to the database.

3. Now it's time to create the stored procedures. For this simply run

```
npm run sp
```

Now you should be ready to explore the data via our API.

### Step 5: Run server

Run:

```
npm run dev
```

The API will now be available at [http://localhost:3000](http://localhost:3000/) || [http://0.0.0.0:3000](http://0.0.0.0:3000/). Check out the API docs below.

## Api docs:

[DOCS](https://docs.google.com/document/d/1EWZ7qr1UmAC5B766JUoVxhJM8ysa296O6u1XBFe5CsI/edit#heading=h.c30eq7rmwd2)

### 1. /api/...

Question: ... <br>
Example response:

```
/.../...
```

### 2. /api/...

Question: ... <br>
Example response:

```
/.../...
```

### 3. /api/...

Question: ... <br>
Example response:

```
/.../...
```

### 4. /api/...

Question: ... <br>
Example response:

```
/.../...
```

### 5. /api/...

Question: ... <br>
Example response:

```
/.../...
```

### 6. /api/...

Question: ... <br>
Example response:

```
/.../...
```

### 7. /api/...

Question: ... <br>
Example response:

```
/.../...
```

### 8. /api/...

Question: ... <br>
Example response:

```
/.../...
```

### 9. /api/...

Question: ... <br>
Example response:

```
/.../...
```

### 10. /api/...

Question: ... <br>
Example response:

```
/.../...
```
