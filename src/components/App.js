import React, { Component } from "react";
import moment from "moment";
import { Container, Row, Col } from "react-bootstrap";
import LoadingOverlay from 'react-loading-overlay';
import b24FetchData from '../utils/bitrix24FetchData';
import Header from './Header';
import Footer from './Footer'
import DealsTable from "./DealsTable";

export default class AppComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            hoursRate: 1000,
            table: {
                data: [],
                columns: [
                    { title: 'Название', field: 'name' },
                    { title: 'Время', field: 'timeFull' },
                    { title: 'Цена', field: 'priceByHours' }
                ],
                payed: false,
            },
            currentMonth: moment().month(),
            beginDate: moment().subtract(2, 'months').endOf('month').format('DD.MM.YYYY'),
            closeDate: moment().startOf('month').format('DD.MM.YYYY')
        };

        this.toPrevMonth = this.toPrevMonth.bind(this);
        this.toNextMonth = this.toNextMonth.bind(this);
    };

    switchMonth(n) {
        const currentMonth = (parseInt(this.state.currentMonth) + n);
        const beginDate = moment().month(currentMonth).endOf('month').subtract(2, 'months').format('DD.MM.YYYY');
        const closeDate = moment().month(currentMonth).startOf('month').format('DD.MM.YYYY');
        this.setState({currentMonth, beginDate, closeDate, isLoaded: false});
    };

    toPrevMonth() {this.switchMonth(-1);}
    toNextMonth() {this.switchMonth(1);}

    componentDidMount() {
        b24FetchData(this.state)
            .then((fetchData) => {
                this.setState({
                    isLoaded: true,
                    ...fetchData
                })
            });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.currentMonth !== prevState.currentMonth) {
            b24FetchData(this.state)
                .then((fetchData) => {
                    this.setState({
                        isLoaded: true,
                        ...fetchData
                    })
                });
        }
    }

    render() {
        const { toPrevMonth, toNextMonth } = this;
        const { error, isLoaded, table, currentMonth } = this.state;

        return (
            <LoadingOverlay
                active={!isLoaded}
                spinner
                text='Загрузка...'
            >
                <Header />
                <main>
                    <Container>
                        <Row>
                            <Col lg={12} tag="section">
                                {
                                    error ? 
                                        <div>Ошибка: {error.message}</div>
                                    :
                                        <DealsTable {...{isLoaded, table, currentMonth, toPrevMonth, toNextMonth}} />
                                }
                            </Col>
                        </Row>
                    </Container>
                </main>
                <Footer />
            </LoadingOverlay>
        );
        
    }
}