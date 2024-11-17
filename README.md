# To do server
This is an express.js project for My Digital School

## How to start
Firstly, run ```git clone 'https://github.com/Ewan-Reveille/to-do-api.git'``` in order to add the repository locally
Secondly, run ```npm install``` to install dependencies
Finally, run ```npm run start``` to start the server locally.

In order to use the front-end, also clone the repertory ```https://github.com/Ewan-Reveille/to-do.git```

## Task tests
In order to check the different parts of the code, here are the different queries possible on Postman

URL: ```http://localhost:8000/task```

### GET
GET (all tasks): You will just have to launch the GET request, as it doesn't require any parameters, nor body.
GET (specific page): In order to search for a specific page, you can also add a parameter "page" on the URL, for example: ```http://localhost:8000/task?page=1```, in order to access the first page.
GET (only for late tasks): If you want to only access the late tasks, you may add "isLate=true" in the URL: ```http://localhost:8000/task?isLate=true```
GET (only for completed or uncompleted tasks): If you want to search a task by its status, you may affix the parameter "isDone", and assign it to 1 if you want the task to be completed, or 0 if you want the task to be uncompleted. ```http://localhost:8000/task?isDone=1```
GET (for a specific task): OIf you want to search the task according to a type name, you may also add the parameter "type": ```http://localhost:8000/task?type=MDS```
GET (a specific task): You have to send the query to the URL ```http://localhost:8000/task/:id```, replacing :id by the specific task you are searching. You will then get as a response the structure of a task, including the content of its type.

### POST
POST: You will have to send the query via the URL ```http://localhost:8000/task```. 
    Query example: 
        {
            "title": "MDS project",
            "description": "Send API work",
            "typeId": 2,
            "dueDate": "2024-11-18T8:00:00.000Z"
        }
    Expected response:
        {
            "id": 61,
            "title": "New Task",
            "description": "Description of the new task",
            "isDone": false,
            "dueDate": "2024-11-30T12:00:00.000Z",
            "createdAt": "2024-11-17T14:46:32.000Z",
            "updatedAt": "2024-11-17T14:46:32.000Z",
            "type": {
                "id": 10,
                "title": "Test type 6",
                "createdAt": "2024-11-11T10:58:36.000Z",
                "updatedAt": "2024-11-11T10:58:36.000Z"
            }
        }

### PUT
PUT: You will have to send the query to the URL ```http://localhost:8000/task/:id```, replacing :id by the task you are willing to edit. 
    Query example:
        {
            "title": "SQL work"
        }
    Expected response:
        {
            "id": 61,
            "title": "SQL work",
            "description": "Description of the new task",
            "isDone": false,
            "dueDate": "2024-11-30T12:00:00.000Z",
            "createdAt": "2024-11-17T14:46:32.000Z",
            "updatedAt": "2024-11-17T15:30:57.000Z",
            "type": {
                "id": 10,
                "title": "Test type 6",
                "createdAt": "2024-11-11T10:58:36.000Z",
                "updatedAt": "2024-11-11T10:58:36.000Z"
            }
        }
    
### DELETE
DELETE: In order to delete a task you will have to target it within its URL: ```http://localhost:8000/task/:id```, while replacing :id by the id of the task you are willing to delete.


## Type tests
URL: ```http://localhost:8000/types```

### GET
GET (all types): You will just have to launch the GET request, as it doesn't require any parameters, nor body.

### POST
POST: You will have to send the query via the URL ```http://localhost:8000/types```. 
    Query example:
        {
            "title": "MDS work"
        }
    Expected response:
        {
            "id": 15,
            "title": "MDS work",
            "updatedAt": "2024-11-17T15:37:00.657Z",
            "createdAt": "2024-11-17T15:37:00.657Z"
        }

### PUT
PUT: You will have to send the query to the URL ```http://localhost:8000/types/:id```, replacing :id by the type you are willing to edit.
    Query example:
        {
            "title": "API work"
        }
    Expected response:
        {
            "id": 15,
            "title": "API work",
            "createdAt": "2024-11-17T15:37:00.000Z",
            "updatedAt": "2024-11-17T15:39:28.000Z"
        }

### DELETE
DELETE: In order to delete a task you will have to target it within its URL: ```http://localhost:8000/types/:id```, while replacing :id by the id of the task you are willing to delete.
