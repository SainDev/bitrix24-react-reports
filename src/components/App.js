import React, { Component } from "react";
import moment from "moment";
import { Container, Row, Col } from "react-bootstrap";
import LoadingOverlay from 'react-loading-overlay';
import b24FetchData from '../utils/bitrix24FetchData';
import Header from './Header';
import Footer from './Footer'
import DealsTable from "./DealsTable";

const hashstr = s => {
    let hash = 0;
    if (s.length == 0) return hash;
    for (let i = 0; i < s.length; i++) {
        let char = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

const cachedFetch = async (url, options) => {
    let expiry = (process.env.NODE_ENV === 'production' ? 30 : 0.01) * 60 // 30 min default
    if (typeof options === 'number') {
        expiry = options
        options = undefined
    } else if (typeof options === 'object') {
        expiry = options.seconds || expiry
    }
    let cacheKey = hashstr(url)
    let cached = localStorage.getItem(cacheKey)
    let whenCached = localStorage.getItem(cacheKey + ':ts')
    if (cached !== null && whenCached !== null) {
        let age = (Date.now() - whenCached) / 1000
        if (!navigator.onLine || age < expiry) {
            let response = new Response(new Blob([cached]))
            return Promise.resolve(response)
        } else {
            localStorage.removeItem(cacheKey)
            localStorage.removeItem(cacheKey + ':ts')
        }
    }

    const response_1 = await fetch(url, options);
    if (response_1.status === 200) {
        let ct = response_1.headers.get('Content-Type');
        if (ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
            response_1.clone().text().then(content => {
                localStorage.setItem(cacheKey, content);
                localStorage.setItem(cacheKey + ':ts', Date.now());
            });
        }
    }
    return response_1;
}

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
                    { title: 'Затраченное время', field: 'timeFull' },
                    { title: 'Сумма (руб)', field: 'price' }
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