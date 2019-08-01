import React, { Component } from "react";
import moment from "moment";
import { apiParams } from "./settings";
import { Modal, Container } from "react-bootstrap";
import DealsTable from "./component/DealsTable";
import LoadingOverlay from 'react-loading-overlay';

//import $ from 'jquery';
//import bootstrap from 'bootstrap';
//import popper from 'popper.js';

export default class AppComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            deals: {},
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
        this.setState({currentMonth, beginDate, closeDate, deals: {}, isLoaded: false});
    };

    toPrevMonth() {this.switch(-1);}
    toNextMonth() {this.switch(1);}

    async getTasks() {
        await fetch(apiParams.apiUrl + apiParams.apiKey +'/crm.deal.list/?order[BEGINDATE]=ASC&filter[%3EBEGINDATE]='+ this.state.beginDate +'&filter[%3CCLOSEDATE]='+ this.state.closeDate +'&filter[COMPANY_ID]='+ apiParams.companyID)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    deals: responseData.result,
                    isLoaded: true
                });
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                })
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
        const { error, isLoaded, deals, currentMonth } = this.state;

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
                        <DealsTable deals={deals} month={currentMonth} isLoaded={isLoaded} {...{toPrevMonth, toNextMonth}} />
                }
            </LoadingOverlay>
        );
        
    }
}