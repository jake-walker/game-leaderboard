import { useQuery, gql } from '@apollo/client';
import React from 'react';
import { Container, Table } from 'react-bootstrap';
import Layout from '../components/layout';

const PlayersQuery = gql`
  query {
    allPlayer {
      id
      name
      wins
      losses
      rank
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(PlayersQuery);

  let content;
  if (error) {
    content = <p>Something went wrong! {error.toString()}</p>;
  } else if (loading) {
    content = <p>Loading...</p>;
  } else {
    const players = [...data.allPlayer].sort((a, b) => ((a.rank > b.rank) ? -1 : 1));

    content = (
      <Table striped hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {
            players.map((player, i) => (
              <tr key={player.id}>
                <td>{i + 1}</td>
                <td>{player.name}</td>
                <td>{player.wins}</td>
                <td>{player.losses}</td>
                <td>{player.rank}</td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    );
  }

  return (
    <Layout title="Leaderboard">
      <section>
        <Container>
          <h1>Leaderboard</h1>
          {content}
        </Container>
      </section>
    </Layout>
  );
}
