import React, { Component } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import moment from "moment";
import Skeleton from 'react-loading-skeleton';

class DealsRow extends Component {
    render() {
        const tasks = this.props.deal.tasks || [];
        const statusClasses = {
            1: '',
            2: '',
            3: 'text-primary',
            4: '',
            5: 'text-success',
            6: '',
            7: ''
        };

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
                                            <li className={"list-group-item d-flex justify-content-between align-items-center " + statusClasses[task.status]} key={task.id}>
                                                {task.name}
                                                {task.time ? <span className="badge badge-primary badge-pill">{task.time}</span> : null}
                                            </li>
                                        ))}
                                    </ul>
                                :
                                    null
                            }
                        </td>
                        <td className="text-center">{this.props.dealTimeFormatted}</td>
                        <td>
                            {
                                moment().month(this.props.currentMonth).subtract(1, 'months').isBefore('2019-08-01') ? 
                                        <abbr title={this.props.dealTimeFormatted}>{this.props.deal.price}</abbr> 
                                    : 
                                        this.props.deal.priceByHours ? 
                                            <abbr title={this.props.dealTimeFormatted}>{this.props.deal.priceByHours}</abbr> 
                                        : 
                                            0
                            }
                        </td>
                    </tr>
                :
                    <tr>
                        <td colSpan="3">Нет данных</td>
                    </tr>
            :
                <tr>
                    <td colSpan="3"><Skeleton /></td>
                </tr>
        );
    }
}

class DealsTable extends Component {
    render() {
        moment.locale('ru');
        const rows = [];
        let fullPrice = 0;
        let fullPriceByHours = 0;
        let fullTime = 0;

        if (this.props.table.data.length > 0) {
            this.props.table.data.map((deal, i) => {
                let dealTimeFormatted = null;

                if (deal.timeFull) {
                    dealTimeFormatted = new Date(deal.timeFull * 1000).toISOString().substr(11, 8);
                    fullTime += parseInt(deal.timeFull);
                }

                rows.push(
                    <DealsRow
                        isLoaded={this.props.isLoaded}
                        deal={deal}
                        dealTimeFormatted={dealTimeFormatted}
                        currentMonth={this.props.currentMonth}
                        key={i} />
                );

                fullPrice += parseInt(deal.price);
                if (deal.priceByHours) {
                    fullPriceByHours += parseInt(deal.priceByHours);
                }
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
                        <th colSpan="3">
                            <Container>
                                <Row>
                                    <Col className="text-left"><Button variant="secondary" href="#" onClick={this.props.toPrevMonth} >{'<'}</Button></Col>
                                    <Col className="align-self-center text-center"><h4>{moment().month(this.props.currentMonth).subtract(1, 'months').format('MMMM')}</h4></Col>
                                    <Col className="text-right"><Button variant="secondary" href="#" onClick={this.props.toNextMonth} >{'>'}</Button></Col>
                                </Row>
                            </Container>
                        </th>
                    </tr>
                    <tr>
                        <th className="align-middle"><strong>Название</strong></th>
                        <th className="align-middle" width="110"><strong>Затраченное время</strong></th>
                        <th className="align-middle" width="75"><strong>Цена (руб)</strong></th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
                <tbody>
                    <tr>
                        <th>Итого</th>
                        <th className="text-center">{fullTime ? new Date(fullTime * 1000).toISOString().substr(11, 8) : null}</th>
                        <th>
                            {
                                moment().month(this.props.currentMonth).subtract(1, 'months').isBefore('2019-08-01') ? 
                                    fullPrice
                                : 
                                    fullPriceByHours
                            }
                        </th>
                    </tr>
                </tbody>
            </Table>
        );
    }
}

export default DealsTable;