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

We have done db stuff with an API layer showcasing our querying.
10 different questions that we base ... off can be found here..
<br>
Explain a lot here......

## How to run

### Step 1: Clone the project

### Step 2: Create .env

Create a .env file with the keys from the already existing .env.template file and insert your own values.

copy dbConnection.template.ts and create dbConnection.ts under utils/db.. change...
well aware that .env is a better solution, but they can't be loaded in wqhen running ts-node....

```
DB_NAME="YOUR_DB_NAME"
DB_PORT="1433"
DB_USER="YOUR_DB_USERNAME"
DB_PASSWORD="YOUR_DB_PASSWORD"
```

### Step 3: Install dependencies

Run:

```
npm install
```

### Step 4: Run database scripts + add data

Execute the .sql scripts from [HERE](https://github.com/SoftDev2425/DB_Assignment_01/tree/master/scripts) in your own database.
To add data open a new terminal and write

```
cd src && ts-node scraper.ts
```

### Step 5: Run server

Run:

```
npm run dev
```

The API will now be available at [http://localhost:3000](http://localhost:3000/) || [http://0.0.0.0:3000](http://0.0.0.0:3000/). Check the below API docs to read more.

## Api docs:

### 1. Get by...

```
/.../...
```

### 2. Get by...

```
/.../...
```

### 3. Get by...

```
/.../...
```

### 4. Get by...

```
/.../...
```

### 5. Get by...

```
/.../...
```

### 6. Get by...

```
/.../...
```

### 7. Get by...

```
/.../...
```

### 8. Get by...

```
/.../...
```

### 9. Get by...

```
/.../...
```

### 10. Get by...

```
/.../...
```
