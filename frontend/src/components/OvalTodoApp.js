import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap';
import renderOval from './renderOval';

const API_URL = 'http://localhost:8000';  // Update this with your actual API URL

const OvalTodoApp = () => {
  const [view, setView] = useState('execution');
  const [hoveredTask, setHoveredTask] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState({});
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tasks/`);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const viewColors = {
    execution: "#1E88E5",
    impact: "#FFA000"
  };

  const handleTaskSelection = (taskId) => {
    setSelectedTasks(prev => ({...prev, [taskId]: !prev[taskId]}));
  };

  const handleTaskCompletion = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const newInstance = {
        completedAt: new Date(),
        duration: task.execution.details.duration
      };
      await axios.post(`${API_URL}/tasks/${taskId}/complete`, newInstance);
      fetchTasks();  // Refetch tasks to get the updated data
    } catch (err) {
      setError('Failed to mark task as complete. Please try again.');
    }
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container fluid className="p-4">
      <h1 className="h2 mb-4">Oval-based Todo App with React-Bootstrap</h1>
      <Row>
        <Col md={3}>
          <h2 className="h4 mb-4">Tasks</h2>
          {tasks.map(task => (
            <div
              key={task.id}
              className={`mb-2 p-2 rounded ${hoveredTask && hoveredTask.id === task.id ? 'bg-light' : ''}`}
            >
              <Form.Check
                id={`task-${task.id}`}
                checked={selectedTasks[task.id] || false}
                onChange={() => handleTaskSelection(task.id)}
                label={task.name}
              />
              <Button
                onClick={() => handleTaskCompletion(task.id)}
                variant="outline-primary"
                size="sm"
                className="ml-2"
              >
                Complete
              </Button>
            </div>
          ))}
        </Col>
        <Col md={9}>
          <div className="mb-4">
            {Object.entries(viewColors).map(([viewName, color]) => (
              <Button
                key={viewName}
                onClick={() => setView(viewName)}
                variant={view === viewName ? "primary" : "outline-primary"}
                className="mr-2 text-capitalize"
                style={{
                  backgroundColor: view === viewName ? color : 'transparent',
                  color: view === viewName ? 'white' : color,
                  borderColor: color
                }}
              >
                {viewName}
              </Button>
            ))}
          </div>
          <Card className="w-100">
            <Card.Body className="p-4">
              {renderOval(tasks, selectedTasks, view, viewColors, setHoveredTask, hoveredTask)}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {hoveredTask && (
        <div className="mt-4 p-4 bg-light rounded">
          <h3 className="h5">{hoveredTask.name}</h3>
          <p>Execution: {hoveredTask.execution.details.duration} minutes, {hoveredTask.execution.details.frequency}</p>
          <p>Completed Instances: {hoveredTask.execution.instances.length}</p>
          <p>Impact: Past {hoveredTask.impact.timePast} days, Future {hoveredTask.impact.timeFuture} days, Space {hoveredTask.impact.space}</p>
        </div>
      )}
    </Container>
  );
};

export default OvalTodoApp;