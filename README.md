# Airline Managment System

A brief description of your project.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [API Routes](#api-routes)
  - [Authentication](#authentication)
  - [Ticket](#ticket)
- [Database](#database)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Provide a brief overview of your project. Mention its purpose and the problems it aims to solve.

## Installation

Describe the steps to set up and run your project locally. Include any dependencies that need to be installed and how to do so.

```bash
# Clone the repository
git clone https://github.com/alperengokbak/Airline-Management-System

# Navigate to the project directory
cd Airline-Management-System

# Install dependencies
npm install
```

## Usage

Explain how to use your project. Provide examples of API requests and responses, if applicable.

```bash
# Run the project
npm start
```

## API Routes

### Authentication

#### `POST /auth/login`

Endpoint to authenticate a user.

##### Request

```json
{
  "username": "example",
  "password": "password123"
}
```

##### Response

```json
{
  "status": "Success",
  "passenger": {
    "passengerId": 1,
    "username": "example",
    "fullName": "John Doe"
  },
  "accessToken": "your-access-token"
}
```

#### `POST /auth/register`

Endpoint to register a new user.

##### Request:

```json
{
  "username": "newuser",
  "password": "newpassword",
  "fullName": "New User"
}
```

##### Response:

```json
{
  "status": "Success"
}
```

### Ticket

#### `GET /ticket/:date/:fromLocation/:toLocation/:numberOfPeople`

Endpoint to display available tickets.

##### Request:

URL Parameters:

- `date`: Date of the flight
- `fromLocation`: Departure location
- `toLocation`: Destination location
- `numberOfPeople`: Number of people

##### Response:

```json
[
  {
    "FlightId": 1,
    "Date": "2023-12-01",
    "FlightNumber": "FL123",
    "Price": 100,
    "AvailableSeats": 50
  }
  // More flights...
]
```

#### `GET /ticket/flights`

Endpoint to display all flights.

##### Response:

```json
[
  {
    "FlightId": 1,
    "Date": "2023-12-01",
    "FlightNumber": "FL123",
    "Price": 100,
    "AvailableSeats": 50
  }
  // More flights...
]
```

#### `POST /ticket/buyticket`

Endpoint to buy a ticket. Requires authentication.

##### Request:

```json
{
  "date": "2023-12-01",
  "fromLocation": "CityA",
  "toLocation": "CityB",
  "fullName": "John Doe"
}
```

##### Response:

```json
{
  "status": "Success"
}
```

#### `DELETE /ticket/cancelticket`

Endpoint to cancel a ticket. Requires authentication.

##### Request:

```json
{
  "flightNumber": "FL123",
  "passengerId": 1
}
```

##### Response:

```json
{
  "status": "Success"
}
```

## Database

Briefly describe the database structure and how it interacts with the application.

## Dependencies

List the main dependencies and their versions used in the project.

- `express`: version
- `msnodesqlv8`: version
- `jsonwebtoken`: version
- `bcrypt`: version
- `dotenv`: version
- `yamljs`: version

## Contributing

Explain how others can contribute to your project. Include information about the development environment setup and the process for submitting pull requests.

## License

Specify the license under which your project is distributed.
