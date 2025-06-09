import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  direction: rtl;
  min-height: 100vh;
  background-color: #f7f7f7;
`;

export const Navbar = styled.nav`
  background-color: #e0e0e0;
  padding: 1rem;
  display: flex;
  gap: 1rem;
`;

export const NavLinkStyled = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d5d5d5;
  }

  &.active {
    background-color: #c0c0c0;
  }
`;

export const MainContent = styled.main`
  padding: 2rem;
`;
