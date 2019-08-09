import React, { Component } from "react";
import moment from "moment";
import { apiParams } from "./settings";
import { Modal, Container, Row, Col, ListGroup } from "react-bootstrap";
import Header from './components/Header';
import DealsTable from "./components/DealsTable";
import LoadingOverlay from 'react-loading-overlay';

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
    let expiry = 30 * 60 // 30 min default
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
        if (age < expiry) {
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

        const queryString = require('query-string');
        let queryParams = queryString.parse(location.search);

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
                ]
            },
            companyID: queryParams.cId ? queryParams.cId : 1,
            currentMonth: moment().month(),
            beginDate: moment().subtract(2, 'months').endOf('month').format('DD.MM.YYYY'),
            closeDate: moment().startOf('month').format('DD.MM.YYYY')
        };

        this.switchCompany();

        this.toPrevMonth = this.toPrevMonth.bind(this);
        this.toNextMonth = this.toNextMonth.bind(this);
    };

    switchCompany(companyID) {
        if (this.state.companyID !== companyID) {
            let currentUrlParams = new URLSearchParams(window.location.search);
            if (!companyID) {
                currentUrlParams.set('cId', this.state.companyID);
                this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());
            } else {
                currentUrlParams.set('cId', companyID);
                this.props.history.push(window.location.pathname + "?" + currentUrlParams.toString());
                this.setState({companyID, isLoaded: false});
            }
        }
    }

    switchMonth(n) {
        const currentMonth = (parseInt(this.state.currentMonth) + n);
        const beginDate = moment().month(currentMonth).endOf('month').subtract(2, 'months').format('DD.MM.YYYY');
        const closeDate = moment().month(currentMonth).startOf('month').format('DD.MM.YYYY');
        this.setState({currentMonth, beginDate, closeDate, isLoaded: false});
    };

    toPrevMonth() {this.switchMonth(-1);}
    toNextMonth() {this.switchMonth(1);}

    async getTasks() {
        await cachedFetch(
                apiParams.apiUrl + apiParams.apiKey
                + '/crm.deal.list/?order[BEGINDATE]=ASC&filter[%3EBEGINDATE]='
                + this.state.beginDate
                + '&filter[%3CCLOSEDATE]='
                + this.state.closeDate
                + '&filter[COMPANY_ID]='
                +  this.state.companyID
            )
            .then((r) => r.json())
            .then((responseData) => {
                let table = this.state.table;
                table.data = [];

                responseData.result.map((deal) => {
                    table.data.push({
                        id: deal.ID,
                        name: deal.TITLE.trim(),
                        price: parseInt(deal.OPPORTUNITY)
                    });
                });

                return table;
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                })
            }).then((table) => {
                if (table.data.length > 0) {
                    table.data.map((deal, i) => {
                        cachedFetch(
                                apiParams.apiUrl + apiParams.apiKey 
                                + '/tasks.task.list/?filter[UF_CRM_TASK]=D_'
                                + deal.id
                            )
                            .then((r) => r.json())
                            .then((responseData) => {
                                table.data[i].tasks = [];
                                table.data[i].timeFull = 0;

                                responseData.result.tasks.map((task, j) => {
                                    if (task.timeSpentInLogs) {
                                        table.data[i].timeFull += parseInt(task.timeSpentInLogs);
                                    }

                                    table.data[i].tasks.push({
                                        id: task.id,
                                        name: task.title.replace('CRM: ', '').trim(),
                                        time: task.timeSpentInLogs ? new Date(task.timeSpentInLogs * 1000).toISOString().substr(11, 8) : null,
                                        status: task.status,
                                    });
                                });

                                table.data[i].hours = table.data[i].timeFull/3600;
                                table.data[i].priceByHours = table.data[i].hours <= 0 || table.data[i].name.substr(0, 9).localeCompare('Поддержка') == 0 ?
                                        table.data[i].price
                                    :
                                        //Округление до десятков
                                        Math.round((table.data[i].hours * parseInt(this.state.hoursRate)) / 10) * 10
                                    ;

                                this.setState({
                                    table: table,
                                    isLoaded: true
                                });
                            },
                            (error) => {
                                this.setState({
                                    isLoaded: true,
                                    error
                                })
                            });
                    });
                } else {
                    this.setState({
                        isLoaded: true
                    })
                }

                return table;
            });
    }

    componentDidMount() {
        this.getTasks();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.currentMonth !== prevState.currentMonth || this.state.companyID !== prevState.companyID) {
            this.getTasks();
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
                            <Col lg={3} tag="aside">
                                <ListGroup style={{marginBottom: 20}}>
                                    <ListGroup.Item action onClick={() => this.switchCompany(1)} className={this.state.companyID == 1 ? 'active' : ''}>
                                        Мигавто
                                    </ListGroup.Item>
                                    <ListGroup.Item action onClick={() => this.switchCompany(3)} className={this.state.companyID == 3 ? 'active' : ''}>
                                        5 Колесо
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col lg={9} tag="section">
                                {
                                    error ? 
                                        <Modal size="sm" aria-labelledby="contained-modal-title-vcenter" centered show onHide={() => {}}>
                                            <Modal.Body>
                                                <div>Ошибка: {error.message}</div>
                                            </Modal.Body>
                                        </Modal>
                                    :
                                        <DealsTable {...{isLoaded, table, currentMonth, toPrevMonth, toNextMonth}} />
                                }
                            </Col>
                        </Row>
                    </Container>
                </main>
            </LoadingOverlay>
        );
        
    }
}