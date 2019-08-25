import React from 'react';
import { YMInitializer } from 'react-yandex-metrika';
import {
    Container
} from 'react-bootstrap';

const Footer = () => (
    <footer style={{marginTop: 20}}>
        <Container className="text-center">
            <small className="text-muted">&copy; 2019 SainDev</small>
            {process.env.NODE_ENV === 'production' ? <YMInitializer accounts={[55057024]} options={{webvisor: true}} /> : null}
        </Container>
    </footer>
);

export default Footer;