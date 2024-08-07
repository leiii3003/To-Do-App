import React, { useState, useEffect, useRef } from 'react';

function Card({ children }) {
    return (
        <div className="card">
            {children}
        </div>
    );
}

function ToDoList() {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [newTask, setNewTask] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [error, setError] = useState('');
    const [allDone, setAllDone] = useState(() => {
        const savedAllDone = localStorage.getItem('allDone');
        return savedAllDone ? JSON.parse(savedAllDone) : false;
    });
    const taskInputRef = useRef(null);
    const dateInputRef = useRef(null);
    const timeInputRef = useRef(null);

    useEffect(() => {
        document.title = 'My To-Do List';
        const link = document.querySelector("link[rel~='icon']");
        if (link) {
            link.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><text y=%2214%22 font-size=%2212%22>📋</text></svg>';
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem('allDone', JSON.stringify(allDone));
    }, [allDone]);

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function handleDateChange(event) {
        setNewDate(event.target.value);
        setError('');
    }

    function handleTimeChange(event) {
        setNewTime(event.target.value);
    }

    function addTask() {
        if (newTask.trim() === '' || newDate === '' || newTime === '') {
            alert('Please fill in all fields');
            return;
        }

        const currentDateTime = new Date();
        const selectedDate = new Date(newDate);
        const selectedDateTime = new Date(`${newDate}T${newTime}`);

        if (selectedDate < currentDateTime.setHours(0, 0, 0, 0)) {
            setError('The selected date has already passed.');
            return;
        }

        if (selectedDate.toDateString() === currentDateTime.toDateString() && selectedDateTime < currentDateTime) {
            setError('The selected time has already passed.');
            return;
        }

        setError('');
        const newTaskObject = {
            text: newTask,
            done: false,
            date: newDate,
            time: newTime
        };
        setTasks([...tasks, newTaskObject]);
        setNewTask('');
        setNewDate('');
        setNewTime('');
    }

    function deleteTask(index) {
        if (window.confirm('Are you sure you want to delete this task?')) {
            const updatedTasks = tasks.filter((_, i) => i !== index);
            setTasks(updatedTasks);
        }
    }

    function markAsDone(index) {
        const updatedTasks = tasks.map((task, i) => i === index ? { ...task, done: !task.done } : task);
        setTasks(updatedTasks);
    }

    function editTask(index) {
        const taskToEdit = tasks[index];
        setNewTask(taskToEdit.text);
        setNewDate(taskToEdit.date);
        setNewTime(taskToEdit.time);
        // Temporarily remove the task from the list
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    }

    function formatTime(timeString) {
        const [hour, minute] = timeString.split(':');
        const hourInt = parseInt(hour, 10);
        const ampm = hourInt >= 12 ? 'PM' : 'AM';
        const formattedHour = hourInt % 12 || 12;
        return `${formattedHour}:${minute} ${ampm}`;
    }

    function handleFocus(event, ref) {
        ref.current.focus();
        ref.current.showPicker();
    }

    function toggleAllDone() {
        if (tasks.length === 0) {
            return;
        }
        const updatedTasks = tasks.map(task => ({ ...task, done: !allDone }));
        setTasks(updatedTasks);
        setAllDone(!allDone);
    }

    function deleteAllTasks() {
        if (window.confirm('Are you sure you want to delete all tasks?')) {
            setTasks([]);
            setAllDone(false);
        }
    }

    return (
        <Card>
            <div className="to-do-list">
                <h1>To-Do List</h1>
                <div>
                    <input
                        ref={taskInputRef}
                        type="text"
                        placeholder="What to do..."
                        value={newTask}
                        onChange={handleInputChange}
                        onFocus={(e) => handleFocus(e, taskInputRef)}
                    />
                    <input
                        ref={dateInputRef}
                        type="date"
                        value={newDate}
                        onChange={handleDateChange}
                        onFocus={(e) => handleFocus(e, dateInputRef)}
                    />
                    <input
                        ref={timeInputRef}
                        type="time"
                        value={newTime}
                        onChange={handleTimeChange}
                        onFocus={(e) => handleFocus(e, timeInputRef)}
                    />
                    <button className="add-button" onClick={addTask}>Add</button>
                </div>
                {error && <p className="error-message">{error}</p>}
                <div>
                    <button className="toggle-all-button" onClick={toggleAllDone}>
                        {allDone ? 'Unmark All' : 'Mark All as Done'}
                    </button>
                    <button className="delete-all-button" onClick={deleteAllTasks}>Delete All</button>
                </div>
                <ol>
                    {tasks.map((task, index) => (
                        <li key={index}>
                            <span className={`text ${task.done ? 'done' : ''}`}>{task.text} - {task.date} - {formatTime(task.time)}</span>
                            <div className="button-container">
                                <button className="done-button" onClick={() => markAsDone(index)}>
                                    {task.done ? '🔄' : '✔️'}
                                </button>
                                <button className="edit-button" onClick={() => editTask(index)}>✏️</button>
                                <button className="delete-button" onClick={() => deleteTask(index)}>🗑️</button>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </Card>
    );
}

export default ToDoList;