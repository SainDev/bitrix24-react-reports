import React, { Component } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import moment from "moment";
import Skeleton from 'react-loading-skeleton';

class DealsRow extends Component {
    render() {
        const tasks = this.props.deal.tasks || [];

        return (
            this.props.isLoaded ?
                Object.keys(this.props.deal).length > 0 ?
                    <tr>
                        <td>
                            <div><strong>{this.props.deal.name}</strong></div>
                            {
                                tasks.length >= 1 && tasks[0].name.localeCompare(this.props.deal.name) !== 0 ?
                                    <ul className="list-group">
                                        {tasks.map(task => (
                                            <li className="list-group-item d-flex justify-content-between align-items-center" key={task.id}>
                                                {task.name}
                                                {task.time ? <span className="badge badge-primary badge-pill">{task.time}</span> : null}
                                            </li>
                                        ))}
                                    </ul>
                                :
                                    null
                            }
                        </td>
                        <td>{parseInt(this.props.deal.price)}</td>
                    </tr>
                :
                    <tr>
                        <td colSpan="2">Нет данных</td>
                    </tr>
            :
                <tr>
                    <td colSpan="2"><Skeleton /></td>
                </tr>
        );
    }
}

class DealsTable extends Component {
    render() {
        const rows = [];
        let fullPrice = 0;
        moment.locale('ru');

        if (this.props.table.data.length > 0) {
            this.props.table.data.map((deal, i) => {
                rows.push(
                    <DealsRow
                        isLoaded={this.props.isLoaded}
                        deal={deal}
                        key={i} />
                );
                {fullPrice += parseInt(deal.price)};
            });
        } else {
            rows.push(
                <DealsRow
                    isLoaded={this.props.isLoaded}
                    deal={{}}
                    key={1} />
            );
        }

        return (
            <Table bordered>
                <thead>
                    <tr>
                        <th colSpan="2">
                            <Container>
                                <Row>
                                    <Col className="text-left"><Button variant="secondary" as="input" type="button" value="<" onClick={this.props.toPrevMonth} /></Col>
                                    <Col className="align-self-center text-center"><h4>{moment().month(this.props.currentMonth).subtract(1, 'months').format('MMMM')}</h4></Col>
                                    <Col className="text-right"><Button variant="secondary" as="input" type="button" value=">" onClick={this.props.toNextMonth} /></Col>
                                </Row>
                            </Container>
                        </th>
                    </tr>
                    <tr>
                        <th className="align-middle"><strong>Название</strong></th>
                        <th className="align-middle" width="75"><strong>Цена (руб)</strong></th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
                <tbody>
                    <tr>
                        <th>Итого</th>
                        <th>{fullPrice}</th>
                    </tr>
                </tbody>
            </Table>
        );
    }
}

export default DealsTable;