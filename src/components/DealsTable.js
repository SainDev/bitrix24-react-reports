import React, { Component } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import moment from "moment";
import Skeleton from 'react-loading-skeleton';
import Done from '@material-ui/icons/Done';
import Pause from '@material-ui/icons/Pause';
import PlayArrow from '@material-ui/icons/PlayArrow';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Tasks from './Tasks';

class DealsRow extends Component {
    render() {
        const tasks = this.props.deal.tasks || [];
        const statuses = {
            1: <Pause className="text-warning" />,
            2: <Pause className="text-warning" />,
            3: <PlayArrow className="text-primary" />,
            4: null,
            5: <Done className="text-success" />,
            6: null,
            7: null
        };

        return (

                <React.Fragment>
                    <tr>
                        <td>
                            <div className="d-flex justify-content-between align-items-center">
                                <strong>{this.props.deal.name}</strong>
                                {tasks.length == 1 && statuses[tasks[0].status] ? <span className="badge badge-light badge-pill status">{statuses[tasks[0].status]}</span> : null}
                            </div>
                        </td>
                        <td className="text-center">{this.props.deal.timeFull ? new Date(this.props.deal.timeFull * 1000).toISOString().substr(11, 8) : null}</td>
                        <td className="text-center">
                            {
                                moment().month(this.props.currentMonth).subtract(1, 'months').isBefore('2019-08-01') ? 
                                        this.props.deal.price
                                    : 
                                        this.props.deal.priceByHours ? 
                                            this.props.deal.priceByHours
                                        : 
                                            0
                            }
                        </td>
                    </tr>
                    <Tasks dealName={this.props.deal.name} {...{tasks, statuses}} />
                </React.Fragment>
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
                if (deal.timeFull) {
                    fullTime += parseInt(deal.timeFull);
                }

                rows.push(
                    <DealsRow
                        deal={deal}
                        currentMonth={this.props.currentMonth}
                        key={i} />
                );

                fullPrice += parseInt(deal.price);
                if (deal.priceByHours) {
                    fullPriceByHours += parseInt(deal.priceByHours);
                }
            });
        }

        return (
            <Table bordered>
                <thead>
                    <tr>
                        <th colSpan="3">
                            <Container>
                                <Row>
                                    <Col className="text-left"><Button variant="secondary" href="#" onClick={this.props.toPrevMonth} ><ChevronLeft fontSize="small" /></Button></Col>
                                    <Col className="align-self-center text-center"><h4>{moment().month(this.props.currentMonth).subtract(1, 'months').format('MMMM')}</h4></Col>
                                    <Col className="text-right"><Button variant="secondary" href="#" onClick={this.props.toNextMonth} ><ChevronRight fontSize="small" /></Button></Col>
                                </Row>
                            </Container>
                        </th>
                    </tr>
                    <tr>
                        <th className="align-middle"><strong>Название</strong></th>
                        <th className="align-middle text-center" width="80"><strong>Время</strong></th>
                        <th className="align-middle text-center" width="65"><strong>Цена</strong></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.isLoaded ?
                            rows.length > 0 ?
                                rows
                            :
                                <tr>
                                    <td colSpan="3">Нет данных</td>
                                </tr>
                        :
                            <tr>
                                <td colSpan="3"><Skeleton /></td>
                            </tr>
                    }
                </tbody>
                <tbody>
                    <tr>
                        <th>
                            <div className="d-flex justify-content-between align-items-center">
                                <strong>Итого</strong>
                                {
                                    rows.length > 0 ?
                                        <span className="badge badge-light badge-pill status">
                                            {this.props.table.payed ? <span className="text-success">Оплачено</span> : <span className="text-warning">Не оплачено</span>}
                                        </span>
                                    :
                                        null
                                }
                            </div>
                        </th>
                        <th className="text-center">{fullTime ? new Date(fullTime * 1000).toISOString().substr(11, 8) : null}</th>
                        <th className="text-center">
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