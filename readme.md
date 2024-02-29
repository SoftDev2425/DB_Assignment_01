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

### Step 2: Install dependencies

Run:

```
npm install
```

### Step 3: Configure DB-connection

Under `src/utils/db` change `dbConnection.template.ts` filename to `dbConnection.ts` and apply your own database configuration. (we are well aware that .env is a better solution, but they can't be loaded when running ts-node in the upcoming way)
The following values will suffice:

- **database**
- **user**
- **password**

### Step 4: Run database scripts + add data

Firstly, execute the .sql scripts from [HERE](https://github.com/SoftDev2425/DB_Assignment_01/tree/master/scripts) in your own database.

Secondly, to add data to the database, open a new terminal, navigate to `src/scraper`and run

```
ts-node index.ts
```

### Step 5: Run server

Run:

```
npm run dev
```

The API will now be available at [http://localhost:3000](http://localhost:3000/) || [http://0.0.0.0:3000](http://0.0.0.0:3000/). Check out the API docs below.

## Api docs:

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
