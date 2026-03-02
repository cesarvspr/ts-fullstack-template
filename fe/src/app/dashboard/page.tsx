'use client';

import styled from 'styled-components';
import { useRequireAuth } from '@/lib/auth';

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  max-width: 48rem;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.foreground};
`;

const SignOutButton = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.foreground};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.5rem;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.foreground}80;
  font-size: 0.875rem;
`;

const Value = styled.span`
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: 500;
`;

export default function DashboardPage() {
  const { user, signOut, isReady } = useRequireAuth();

  if (!isReady) return null;

  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
        <SignOutButton onClick={signOut}>Sign Out</SignOutButton>
      </Header>
      <Card>
        <Row>
          <Label>Name</Label>
          <Value>{user?.name}</Value>
        </Row>
        <Row>
          <Label>Email</Label>
          <Value>{user?.email}</Value>
        </Row>
        <Row>
          <Label>Role</Label>
          <Value>{user?.role}</Value>
        </Row>
      </Card>
    </Container>
  );
}
