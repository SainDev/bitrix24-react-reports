import React, { Component } from "react";
import moment from "moment";
import { apiParams } from "./settings";
import { Modal, Container } from "react-bootstrap";
import DealsTable from "./component/DealsTable";
import LoadingOverlay from 'react-loading-overlay';

export default class AppComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            table: {
                data: [],
                columns: [
                    { title: 'Название', field: 'name' },
                    { title: 'Сумма (руб)', field: 'amount' }
                ]
            },
            currentMonth: moment().month(),
            beginDate: moment().subtract(2, 'months').endOf('month').format('DD.MM.YYYY'),
            closeDate: moment().startOf('month').format('DD.MM.YYYY')
        };
        this.toPrevMonth = this.toPrevMonth.bind(this);
        this.toNextMonth = this.toNextMonth.bind(this);
    };

    switch(n) {
        const currentMonth = (parseInt(this.state.currentMonth) + n);
        const beginDate = moment().month(currentMonth).endOf('month').subtract(2, 'months').format('DD.MM.YYYY');
        const closeDate = moment().month(currentMonth).startOf('month').format('DD.MM.YYYY');
        this.setState({currentMonth, beginDate, closeDate, isLoaded: false});
    };

    toPrevMonth() {this.switch(-1);}
    toNextMonth() {this.switch(1);}

    async getTasks() {
        await fetch(apiParams.apiUrl + apiParams.apiKey +'/crm.deal.list/?order[BEGINDATE]=ASC&filter[%3EBEGINDATE]='+ this.state.beginDate +'&filter[%3CCLOSEDATE]='+ this.state.closeDate +'&filter[COMPANY_ID]='+ apiParams.companyID)
            .then((response) => response.json())
            .then((responseData) => {
                let table = this.state.table;
                table.data = [];

                responseData.result.map((deal) => {
                    table.data.push({
                        id: deal.ID,
                        name: deal.TITLE.trim(),
                        amount: deal.OPPORTUNITY
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
                        fetch(apiParams.apiUrl + apiParams.apiKey +'/tasks.task.list/?filter[UF_CRM_TASK]=D_'+ deal.id)
                            .then((response) => response.json())
                            .then((responseData) => {
                                table.data[i].tasks = [];

                                responseData.result.tasks.map((task, j) => {
                                    table.data[i].tasks.push({
                                        id: task.id,
                                        name: task.title.replace('CRM: ', '').trim()
                                    });
                                });

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
        if (this.state.currentMonth !== prevState.currentMonth) {
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
            </LoadingOverlay>
        );
        
    }
}