import React from 'react';
import logo from '../logo.svg';

import {
    Container, Navbar, Nav
} from 'react-bootstrap';

const Header = () => (
    <header style={{marginBottom: 20}}>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/" style={{ width: 50 }}>
                    <img src={logo} alt="logo" className="position-relative img-fluid" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {/*<Nav.Link eventKey="1" href="#" active={companyID == 1 ? true : false} onClick={toMigavto}>Мигавто</Nav.Link>
                        <Nav.Link eventKey="3" href="#" active={companyID == 3 ? true : false} onClick={to5koleso}>5 Колесо</Nav.Link>*/}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
);

export default Header;