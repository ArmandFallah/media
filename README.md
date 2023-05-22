## Introduction

The application is called Media. It is built with create-react-app, express, and postgreSQL. It allows users to post text to the page through a textbox. Once the post is up the user can edit the post or delete it individually. The user also has the option to delete all posts.

## Architecture Overview

1. Frontend: Built with react and sends http requests to the API based on user interaction
2. Backend: Express server that handles incoming requests and communicates with the PostgreSQL db
3. Database: PostgreSQL database with one table. Holds information about each tweet

## Getting Started

### Prerequisites

1. Create-react-app
2. Node.js
3. PostgreSQL

### Installation

1. Create dir to hold application and all required files
2. brew install node
3. brew install postgresql
4. Run npm install in `my-server` and the root directory

### Running the Project

1. Start server with node index.js
2. Start application with npm run start

## Tech Stack / Libraries Used

1. React
2. React-query
3. Express
4. PostgreSQL

## System Design and Flow

- When the page is loaded, fetch is used to send an http GET request to the API which then fetches the initial values in the postgreSQL database table and displays them on the page.

- After the user types into the textbox and presses submit, a POST request containing the text entered into the box is sent to the API which then gets the pg(postgresSQL) database to create a new row with 3 columns: id, value, and created_at. Once the request has been fufilled an object with the 3 values is sent back to the API which then returns it to the front end. The texts values are displayed in a list on the page.

- The user can interact with the list either by choosing to edit the tweet or delete it.

- If the user presses edit, a new text box with 'confirm' and 'cancel' buttons are displayed and the orginial text of the list element is displayed in the edit box.

- If the user chooses to cancel the edit, the element will return to its previous state, no matter what was in the textbox.

- If the user chooses to press confirm, the front end sends a PUT request with the edited text and the id of the edited tweet to the API. The API tells the database to update the chosen value then recieves the new value and returns it to the front end.

- If the user chooses to press delete, the front end sends a DELETE request with the id of the chosen element. The API gets the pg database to delete the row with the given id then sends back the id of the deleted element to the front end.
