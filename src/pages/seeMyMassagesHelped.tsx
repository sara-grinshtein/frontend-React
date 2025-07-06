 import React, { useEffect, useState } from 'react';
import axiosInstance from '../sevices/axios';
import { MessageType } from '../types/messsage.types';
import { ResponseType } from '../types/response.types';
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
  Modal,
  ModalContent,
  Input,
  Textarea
} from "./style-seeMyMessages";
import jwt_decode from 'jwt-decode';

type MyToken = {
  sub: string;
  name?: string;
  exp: number;
  userId: string; 
};

const SeeMyMassagesHelped = () => {
  const [massages, setMassages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [context, setContext] = useState('');
  const [rating, setRating] = useState<number>(5);

  const token = localStorage.getItem('token');
  const decodedToken = token ? jwt_decode<MyToken>(token) : null;
  const helpedIdFromToken = decodedToken?.userId ? parseInt(decodedToken.userId) : null;

  // ✅ פונקציה שמביאה את כל הבקשות מחדש מהשרת
  const fetchMassages = async () => {
    try {
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get(`/message/my-messages`);
      setMassages(response.data);
    } catch (error) {
      console.error("Error fetching massages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMassages();
  }, []);

  const openModal = (messageId: number) => {
    setSelectedMessageId(messageId);
    setContext('');
    setRating(5);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!selectedMessageId || !token || helpedIdFromToken === null) return;

    const responsePayload = {
      helped_id: helpedIdFromToken,
      message_id: selectedMessageId,
      context,
      rating
    };

    try {
      await axiosInstance.post('/response', responsePayload);
      setShowModal(false);
      await fetchMassages(); // ✅ רענון הרשימה אחרי שליחת תגובה
    } catch (error) {
      console.error("❌ שגיאה בשליחת תגובה לשרת:", error);
    }
  };

  if (loading) return <Loading>טוען...</Loading>;

  return (
    <Container>
      <Title>עמוד שנעזר רואה את הבקשות שהוא הכניס ויכול להשאיר תגובות</Title>
      <SubTitle>הבקשות שביקשתי</SubTitle>

      {massages.length === 0 ? (
        <Empty>לא נמצאו בקשות</Empty>
      ) : (
        massages.map((massage) => (
          <MessageCard key={massage.message_id}>
            <Field><Label>תיאור:</Label> {massage.description}</Field>

            {massage.location && (
              <Field>
                <Label>כתובת:</Label> {massage.location}
              </Field>
            )}

            <Field>
              <Label>טופל:</Label> 
              <Value isPositive={massage.isDone}>{massage.isDone ? 'כן' : 'לא'}</Value>
            </Field>

            <Field>
              <Label>אישור הגעה:</Label> 
              <Value isPositive={massage.confirmArrival}>{massage.confirmArrival ? 'כן' : 'לא'}</Value>
            </Field>

            <Button onClick={() => openModal(massage.message_id)}>השאר תגובה</Button>
          </MessageCard>
        ))
      )}

      {showModal && (
        <Modal>
          <ModalContent>
            <h2>השאר תגובה</h2>
            <Label>תגובה:</Label>
            <Textarea 
              value={context} 
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContext(e.target.value)} 
            />
            <Label>דירוג (1-5):</Label>
            <Input 
              type="number" 
              min="1" 
              max="5" 
              value={rating} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRating(Number(e.target.value))} 
            />
            <Button onClick={handleSubmit}>שלח</Button>
            <Button onClick={() => setShowModal(false)}>בטל</Button>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default SeeMyMassagesHelped;
