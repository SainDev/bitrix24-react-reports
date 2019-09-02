import React from 'react';
import logo from '../logo.svg';

import {
    Container, Navbar, Nav
} from 'react-bootstrap';

const Header = () => (
    <header style={{marginBottom: 20}}>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/" style={{ width: 50, fontSize: '1rem' }}>
                    <img src={logo} alt="logo" className="d-inline-block align-middle" />
                    {'Отчеты по задачам SainDev'}
                </Navbar.Brand>
            </Container>
        </Navbar>
    </header>
);

export default Header;