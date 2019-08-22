import React from 'react';

const Tasks = ({dealName, tasks, statuses}) => {
    return (
        tasks.length >= 1 && tasks[0].name.localeCompare(dealName) !== 0 ?
            tasks.map(task => (
                <tr key={task.id}>
                    <td>
                        <div className="d-flex justify-content-between align-items-center">
                            {task.name}
                            {statuses[task.status] ? <span className="badge badge-light badge-pill status">{statuses[task.status]}</span> : null}
                        </div>
                    </td>
                    <td className="text-center">{task.time}</td>
                    <td className="text-center"></td>
                </tr>
            ))
        :
            null
    );
};

export default Tasks;