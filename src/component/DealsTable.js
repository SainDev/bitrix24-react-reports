import React, { Component } from "react";
import { Container, Row, Col, Table, Navbar, Nav, Button } from "react-bootstrap";
import moment from "moment";
import Task from "./Task";

class DealsRow extends Component {
    render() {
        const deal = this.props.deal;

        return (
            <tr>
                <td>
                    <div><h6>{deal.TITLE}</h6></div>
                    <Task dealId={deal.ID} />
                </td>
                <td>{parseInt(deal.OPPORTUNITY)}</td>
            </tr>
        );
    }
}

class DealsTable extends Component {
    render() {
        const rows = [];
        var fullPrice = 0;
        moment.locale('ru');

        this.props.deals.forEach((deal) => {
            rows.push(
                <DealsRow
                    deal={deal}
                    key={deal.ID} />
            );
            {fullPrice += parseInt(deal.OPPORTUNITY)};
        });

        return (
            <Container>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th colSpan="2">
                                <Container>
                                    <Row>
                                        <Col className="text-left"><Button as="input" type="button" value="<" onClick={this.props.toPrevMonth} /></Col>
                                        <Col className="align-self-center text-center"><h4>{moment().month(this.props.month).subtract(1, 'months').format('MMMM')}</h4></Col>
                                        <Col className="text-right"><Button as="input" type="button" value=">" onClick={this.props.toNextMonth} /></Col>
                                    </Row>
                                </Container>
                            </th>
                        </tr>
                        <tr>
                            <th>Название</th>
                            <th>Цена (руб)</th>
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
            </Container>
        );
    }
}

export default DealsTable;