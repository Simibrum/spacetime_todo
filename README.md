# Oval-based Todo App

This project is a todo application that visualizes tasks in an oval-based representation, allowing users to see their tasks' execution and impact over time and space.

## Project Structure

The project consists of two main parts:

1. Frontend: A React application
2. Backend: A FastAPI application
3. Database: MongoDB

## Prerequisites

- Docker and Docker Compose
- Node.js and npm (for local development of the frontend)
- Python 3.8+ (for local development of the backend)

## Getting Started

### Running with Docker Compose

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/oval-todo-app.git
   cd oval-todo-app
   ```

2. Start the application using Docker Compose:
   ```
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Local Development

#### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

#### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```
   uvicorn app.main:app --reload
   ```

## Features

- Oval-based visualization of tasks
- Task creation and management
- Execution and impact views
- Integration with MongoDB for data persistence

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.