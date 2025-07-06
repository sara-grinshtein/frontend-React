import React, { useEffect, useState } from 'react';
import axiosInstance from '../sevices/axios';
import { MessageType } from '../types/messsage.types';
import {
  Container,
  Title,
  SubTitle,
  MessageCard,
  Field,
  Label,
  Value,
  Loading,
  Empty,
} from "./style-seeMyMessages";
import jwt_decode from 'jwt-decode';

type MyToken = {
  userId: string;
  exp: number;
};

const SeeAssignedMessagesVolunteer = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const decodedToken = token ? jwt_decode<MyToken>(token) : null;

  const fetchMessages = async () => {
    try {
      if (!token) {
        console.error("לא קיים טוקן");
        setLoading(false);
        return;
      }

      // ✅ קריאה ל-API הנכון (לפי הטוקן, אין צורך ב-id)
      const response = await axiosInstance.get("/message/my-messages");
      setMessages(response.data);
    } catch (error) {
      console.error("שגיאה בשליפת ההודעות של המתנדב:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) return <Loading>טוען בקשות...</Loading>;

  return (
    <Container>
      <Title>עמוד משימות שלי כמתנדב</Title>
      <SubTitle>בקשות ששובצת אליהן</SubTitle>

      {messages.length === 0 ? (
        <Empty>לא שובצת לבקשות</Empty>
      ) : (
        messages.map((msg) => (
          <MessageCard key={msg.message_id}>
            <Field><Label>כותרת:</Label> {msg.title}</Field>
            <Field><Label>תיאור:</Label> {msg.description}</Field>
            <Field><Label>כתובת:</Label> {msg.location}</Field>
            <Field>
              <Label>אישור הגעה:</Label>
              <Value isPositive={msg.confirmArrival}>{msg.confirmArrival ? 'כן' : 'לא'}</Value>
            </Field>
            <Field>
              <Label>טופל:</Label>
              <Value isPositive={msg.isDone}>{msg.isDone ? 'כן' : 'לא'}</Value>
            </Field>
          </MessageCard>
        ))
      )}
    </Container>
  );
};

export default SeeAssignedMessagesVolunteer;
