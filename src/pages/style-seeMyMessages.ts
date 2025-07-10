import styled from 'styled-components';

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  direction: rtl;
`; 

export const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
`;

export const SubTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: right;
`;

export const MessageCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: #fafafa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const Field = styled.p`
  margin: 8px 0;
`;

export const Label = styled.span`
  font-weight: bold;
`;

export const Value = styled.span<{ isPositive?: boolean }>`
  color: ${props => props.isPositive === undefined ? 'inherit' : props.isPositive ? '#2e7d32' : '#c62828'};
  margin-right: 8px;
`;

export const Loading = styled.div`
  text-align: center;
  font-size: 18px;
  padding: 40px 0;
`;

export const Empty = styled.div`
  text-align: center;
  color: #777;
  font-size: 16px;
`;
export const Button = styled.button`
  background-color: #1976d2;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 12px;
  margin-left: 8px;

  &:hover {
    background-color: #1565c0;
  }
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  text-align: right;
  direction: rtl;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 8px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
`;
