import { useQuery, gql } from '@apollo/client';
import React from 'react';
import { Container, Table } from 'react-bootstrap';
import Layout from '../components/layout';

const GamesQuery = gql`
  query {
    allGame {
      id
      date
      winner {
        name
      }
      loser {
        name
      }
      location
    }
  }
`;

export default function Games() {
  const { loading, error, data } = useQuery(GamesQuery);

  let content;
  if (error) {
    content = <p>Something went wrong! {error.toString()}</p>;
  } else if (loading) {
    content = <p>Loading...</p>;
  } else {
    const games = [...data.allGame].sort((a, b) => (new Date(b.date) - new Date(a.date)));

    content = (
      <Table striped hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Winner</th>
            <th>Loser</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {
            games.map((game) => (
              <tr key={game.id}>
                <td>{(new Date(game.date)).toLocaleString()}</td>
                <td>{game.winner.name}</td>
                <td>{game.loser.name}</td>
                <td>{game.location}</td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    );
  }

  return (
    <Layout title="Games">
      <section>
        <Container>
          <h1>Games</h1>
          {content}
        </Container>
      </section>
    </Layout>
  );
}
