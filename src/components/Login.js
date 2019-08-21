import React from 'react';
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import auth from "./Auth";

const Login = () => {
    return (
        <Container>
            <Row className="justify-content-sm-center">
                <Col xs sm="6" lg="4" style={{marginTop: 20}}>
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
                </Col>
            </Row>
        </Container>
    );
};

export default Login;