// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../sevices/axios'
// import { MessageType } from '../types/messsage.types';

// const SeeMyMassagesHelped = () => {
//     const [massages, setMassages] = useState<MessageType[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         (async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     console.error("No token found");
//                     setLoading(false);
//                     return;
//                 }

//                 const response = await axiosInstance.get(`/message/my-messages`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });

//                 setMassages(response.data);
//             } catch (error) {
//                 console.error("Error fetching massages:", error);
//             } finally {
//                 setLoading(false);
//             }
//         })();
//     }, []);

//     if (loading) return <div>טוען...</div>;

//     return (
//         <div className="p-4">
//             <h1> עמוד שנעזר רואה את הבשקשות שהוא הכניס ויכול להשאיר תגובות</h1>
//             <h1 className="text-xl font-bold mb-4">הבקשות שלי</h1>
//             {massages.length === 0 ? (
//                 <div>לא נמצאו בקשות</div>
//             ) : (
//                 <ul className="space-y-2">
//                     {massages.map((massage) => (
//                         <li key={massage.message_id} className="p-2 border rounded">
//                             <p><strong>תיאור:</strong> {massage.description}</p>
//                             <p><strong>טופל:</strong> {massage.isDone ? "כן" : "לא"}</p>
//                             <p><strong>אישור הגעה:</strong> {massage.confirmArrival ? "כן" : "לא"}</p>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default SeeMyMassagesHelped;

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
  Empty
} from "./style-seeMyMessages";

const SeeMyMassagesHelped = () => {
  const [massages, setMassages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found");
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get(`/message/my-messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setMassages(response.data);
      } catch (error) {
        console.error("Error fetching massages:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
            <Field>
              <Label>טופל:</Label> 
              <Value isPositive={massage.isDone}>{massage.isDone ? 'כן' : 'לא'}</Value>
            </Field>
            <Field>
              <Label>אישור הגעה:</Label> 
              <Value isPositive={massage.confirmArrival}>{massage.confirmArrival ? 'כן' : 'לא'}</Value>
            </Field>
          </MessageCard>
        ))
      )}
    </Container>
  );
};

export default SeeMyMassagesHelped;
