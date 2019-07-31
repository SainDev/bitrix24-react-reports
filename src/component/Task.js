import React, { useEffect, useState } from 'react';
import { apiParams } from "../settings";

const Task = ({dealId}) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        getTasks();
    }, []);

    async function getTasks() {
        /*const response = await fetch(apiParams.apiUrl + apiParams.apiKey +'/tasks.task.list/?filter[UF_CRM_TASK]=D_'+ dealId);
        const tasks = await response.json();
        setTasks(tasks);*/
        await fetch(apiParams.apiUrl + apiParams.apiKey +'/tasks.task.list/?filter[UF_CRM_TASK]=D_'+ dealId)
            .then((response) => response.json())
            .then((responseData) => {
                const tasks = responseData.result.tasks;
                setTasks(tasks);
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                })
            });
    }

    if(tasks) {
        return (
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>{task.title.replace('CRM: ', '')}</li>
                ))}
            </ul>
        );
    }
};

export default Task;