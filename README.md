# Thesaurus Service

Thesaurus Service is a Node.js-based HTTP server that allows users to store and search for sets of synonyms. It provides endpoints to add new set of synonyms and search for synonyms for a given word. The solution is designed to be simple, efficient, and thread-safe, using in-memory data structures without any database.

## **Requirements**

To run this project, you need to have the following tools installed on your system:

-   Node.js (v14 or above)
-   npm (Node Package Manager)

## **Getting Started**

1. Clone the repository:

    ```go
    git clone https://github.com/demoS11/thesaurus-service.git
    cd thesaurus-service
    ```

2. Install dependencies:

    ```go
    npm install
    ```

3. Start the server:

    ```go
    npm start
    ```

    The server should now be running on **`http://localhost:5001`**.

## **Endpoints**

To access the Swagger documentation, open your web browser and navigate to the following URL: **[http://localhost:5001/documentation#](http://localhost:5001/documentation#)**

### **Add Synonyms**

Endpoint: **`POST /synonyms`**

Add a new set of synonyms. For example, you can add a pair of synonyms like "begin" and "start."

**Request Body:**

```go
{
  "word": "begin",
  "synonym": "start"
}
```

**Response:**

-   Status: 201 Created Message

### **Search Synonyms**

Endpoint: **`GET /synonyms`**

Search for synonyms for a given word. For example, searching for "begin" or "start" should return the respective synonym in a symmetrical relationship.

**Query Parameters:**

-   **`word`** (required): The word for which synonyms need to be searched.

**Response:**

-   Status: 200 OK

```go
{
  "synonyms": ["start"]
}
```

### **Transitive Rule**

The Thesaurus Service implements a transitive rule. For example, if "A" is added as a synonym for "B," and "B" is added as a synonym for "C," then searching the word "C" should return both "B" and "A."

## **Testing**

To run the tests, use the following command:

```go
npm test
```

## **Linting**

To lint the codebase, use the following command:

```
npm run lint
```
