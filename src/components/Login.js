import React from 'react';
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import auth from "../utils/Auth";
import Footer from './Footer'

const Login = () => {
    return (
        <Container>
            <Row className="justify-content-sm-center align-items-center">
                <Col xs sm="6" lg="4">
                    <Card className="text-center">
                        <Card.Header>Вход</Card.Header>
                        <Card.Body>
                            <Form onSubmit={(e) => {
                                e.preventDefault();
                                auth.login(e.target.token.value, () => {
                                    if (e.target.token.value) {
                                        window.location.reload(false);
                                    }
                                });
                            }}>
                                <Form.Group controlId="formBasicToken">
                                    <Form.Control type="text" name="token" placeholder="Введите пароль" />
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Войти
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <Footer />
                </Col>
            </Row>
        </Container>
    );
};

export default Login;