import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Container, Navbar, Nav } from 'react-bootstrap';

export default function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>
          {`${title} | Game Leaderboard`}
        </title>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar bg="dark" variant="dark" expand="sm">
        <Container>
          <Navbar.Brand>Game Leaderboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref>
                <Nav.Link>Leaderboard</Nav.Link>
              </Link>
              <Link href="/games" passHref>
                <Nav.Link>Games</Nav.Link>
              </Link>
              <Link href="/register" passHref>
                <Nav.Link>Register</Nav.Link>
              </Link>
              <Link href="/add" passHref>
                <Nav.Link>Add Game</Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main>
        {children}
      </main>
    </>
  );
}
