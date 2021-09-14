import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { gql, useMutation } from '@apollo/client';
import Link from 'next/link';
import Layout from '../components/layout';

const RegisterMutation = gql`
  mutation ($name: String!) {
    addPlayer(name: $name) {
      id
    }
  }
`;

export default function Register() {
  const [registerFunction, { loading, error, data }] = useMutation(RegisterMutation);

  const [inputField, setInputField] = React.useState({
    name: '',
  });

  const inputHandler = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    registerFunction({
      variables: {
        name: inputField.name,
      },
    });
    e.preventDefault();
  };

  let content;

  if (error) {
    content = <p>Something went wrong! {error.toString()}</p>;
  } else if (loading) {
    content = <p>Registering...</p>;
  } else if (data) {
    content = (
      <>
        <p>Thanks {inputField.name}, you are now registered!</p>
        <Link href="/" passHref>
          <Button variant="dark">Home</Button>
        </Link>
      </>
    );
  } else {
    content = (
      <>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Your name" name="name" onChange={inputHandler} value={inputField.name} />
          </Form.Group>
          <Button variant="dark" type="submit">
            Register
          </Button>
        </Form>
      </>
    );
  }

  return (
    <Layout title="Register">
      <section>
        <Container>
          <h1>Register</h1>
          {content}
        </Container>
      </section>
    </Layout>
  );
}
