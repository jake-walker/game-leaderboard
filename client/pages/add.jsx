import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useQuery, useMutation, gql } from '@apollo/client';
import Link from 'next/link';
import Layout from '../components/layout';

const PlayersQuery = gql`
  query {
    allPlayer {
      id
      name
    }
  }
`;

const GameMutation = gql`
  mutation ($winnerId: String!, $loserId: String!, $location: String) {
    addGame(winner: $winnerId, loser: $loserId, location: $location) {
      id
    }
  }
`;

function PlayerSelect({ players, controlId, controlName, value, handler }) {
  return (
    <Form.Group className="mb-3" controlId={controlId}>
      <Form.Label>{controlName}</Form.Label>
      <Form.Select name={controlId} onChange={handler} value={value}>
        <option value="" disabled selected hidden>Select one</option>
        {players.map((player) => <option value={player.id} key={player.id}>{player.name}</option>)}
      </Form.Select>
    </Form.Group>
  );
}

export default function AddGame() {
  const { loading, error: playersError, data: playersData } = useQuery(PlayersQuery);
  const [addGame, { loading: adding, error: gameError, data: gameData }] = useMutation(GameMutation);

  const [inputField, setInputField] = React.useState({
    winner: '',
    loser: '',
    location: '',
  });

  const inputHandler = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    addGame({
      variables: {
        winnerId: inputField.winner,
        loserId: inputField.loser,
        location: inputField.location,
      },
    });
    e.preventDefault();
  };

  let content;

  if (playersError) {
    content = <p>Something went wrong while fetching players! {playersError.toString()}</p>;
  } else if (gameError) {
    content = <p>Something went wrong while adding the game! {playersError.toString()}</p>;
  } else if (loading) {
    content = <p>Loading...</p>;
  } else if (adding) {
    content = <p>Adding game...</p>;
  } else if (gameData) {
    content = (
      <>
        <p>Great! The game is now recorded.</p>
        <Link href="/" passHref>
          <Button variant="dark">Home</Button>
        </Link>
      </>
    );
  } else {
    const players = [...playersData.allPlayer].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    content = (
      <Form onSubmit={submitHandler}>
        <PlayerSelect players={players} controlId="winner" controlName="Winner" value={inputField.winner} handler={inputHandler} />
        <PlayerSelect players={players} controlId="loser" controlName="Loser" value={inputField.loser} handler={inputHandler} />
        <Form.Group className="mb-3" controlId="location">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" name="location" value={inputField.location} onChange={inputHandler} />
          <Form.Text className="text-muted">
            Where did you play the game? e.g. Centeen
          </Form.Text>
        </Form.Group>
        <Button variant="dark" type="submit">
          Add Game
        </Button>
      </Form>
    );
  }

  return (
    <Layout title="Add Game">
      <section>
        <Container>
          <h1>Add Game</h1>
          {content}
        </Container>
      </section>
    </Layout>
  );
}
