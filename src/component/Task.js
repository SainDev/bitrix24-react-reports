import React, { useEffect, useState } from 'react';
import { apiParams } from "../settings";
import Skeleton from 'react-loading-skeleton';

const Task = ({dealId}) => {
    const [tasks, setTasks] = useState([{isLoaded: false, data: {}}]);

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
                const tasks = {
                    isLoaded: true,
                    data: responseData.result.tasks
                };
                setTasks(tasks);
            }).catch(console.log);
    }

    return (
        tasks.isLoaded ?
            <ul>
                {tasks.data.map(task => (
                    <li key={task.id}>{task.title.replace('CRM: ', '')}</li>
                ))}
            </ul>
        :
            <Skeleton />
    );
};

export default Task;