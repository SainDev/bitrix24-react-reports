import React, { Component } from "react";
import { Container, Table, Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import moment from "moment";
import Task from "./Task";

class DealsRow extends Component {
    render() {
        const deal = this.props.deal;

        return (
            <tr>
                <td>
                    <div>{deal.TITLE}</div>
                    <Task dealId={deal.ID} />
                </td>
                <td>{parseInt(deal.OPPORTUNITY)}</td>
            </tr>
        );
    }
}

class DealsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMonth: moment().month()
        };
        //console.log(this.props);
        //console.log(this.state);
    }

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
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th colSpan="2" className="text-center">
                            <Navbar bg="light" variant="light">
                                <Nav className="mr-auto">
                                    <Button as="input" type="button" value="<" onClick={this.props.toPrevMonth} />
                                </Nav>
                                <Navbar.Brand className="mr-auto">{moment().month(this.props.month).format('MMMM')}</Navbar.Brand>
                                <Nav>
                                <Button as="input" type="button" value=">" onClick={this.props.toNextMonth} />
                                </Nav>
                            </Navbar>
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
        );
    }
}

export default DealsTable;