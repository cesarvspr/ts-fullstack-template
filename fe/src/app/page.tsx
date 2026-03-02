'use client';

import Link from 'next/link';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.foreground}80;
  font-size: 1.125rem;
  margin-bottom: 2.5rem;
  text-align: center;
  max-width: 32rem;
  line-height: 1.6;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.95rem;
  }
`;

const StyledLink = styled(Link)`
  padding: 0.875rem 2rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.radii.md};
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.primary}40;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default function Home() {
  return (
    <Container>
      <Title>ts-fullstack-template</Title>
      <Subtitle>
        Fastify + GraphQL Yoga + Pothos + Prisma + Next.js +
        styled-components
      </Subtitle>
      <StyledLink href="/login">Sign In</StyledLink>
    </Container>
  );
}
