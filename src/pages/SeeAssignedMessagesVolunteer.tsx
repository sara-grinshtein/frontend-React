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
  Button,
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
      const response = await axiosInstance.get("/message/my-messages");
      setMessages(response.data);
    } catch (error) {
      console.error("שגיאה בשליפת ההודעות:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmArrival = async (messageId: number) => {
    try {
      await axiosInstance.post(`/message/confirm-arrival/${messageId}`);
      await fetchMessages(); // רענון לאחר אישור הגעה
    } catch (error) {
      console.error("שגיאה באישור הגעה:", error);
      alert("אירעה שגיאה באישור הגעה");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) return <Loading>טוען בקשות...</Loading>;

  return (
    <Container>
      <Title>ברוך הבא לדף מתנדב</Title>
      <SubTitle>בקשות ששובצת אליהן</SubTitle>

      {messages.length === 0 ? (
        <Empty>לא שובצת לבקשות</Empty>
      ) : (
        messages.map((msg) => (
          <MessageCard key={msg.message_id}>
            <Field><Label>כותרת:</Label> {msg.title}</Field>
            <Field><Label>תיאור:</Label> {msg.description}</Field>
            <Field><Label>כתובת:</Label> {msg.location}</Field>
            <Field><Label>טלפון ליצירת קשר:</Label> {msg.phone}</Field>

    <Field>
  <Label>אישור הגעה:</Label>
  {msg.confirmArrival === true ? (
    <Value isPositive>✔ אישור הגעה</Value>
  ) : (
    <Button onClick={() => handleConfirmArrival(msg.message_id)}>אני מגיע</Button>
  )}
</Field>


            <Field>
              <Label>טופל:</Label>
              <Value isPositive={msg.isDone}>{msg.isDone ? "כן" : "לא"}</Value>
            </Field>
          </MessageCard>
        ))
      )}
    </Container>
  );
};

export default SeeAssignedMessagesVolunteer;
