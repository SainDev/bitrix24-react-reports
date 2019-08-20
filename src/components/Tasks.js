import React from 'react';

const Tasks = ({dealName, tasks, statuses}) => {
    return (
        tasks.length >= 1 && tasks[0].name.localeCompare(dealName) !== 0 ?
            <ul className="list-group tasks">
                {tasks.map(task => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={task.id}>
                        <div>{task.name}</div>
                        {task.time ? <span className="badge badge-primary badge-pill d-none d-sm-inline">{task.time}</span> : null}
                        {statuses[task.status] ? <span className="badge badge-light badge-pill status">{statuses[task.status]}</span> : null}
                    </li>
                ))}
            </ul>
        :
            null
    );
};

export default Tasks;