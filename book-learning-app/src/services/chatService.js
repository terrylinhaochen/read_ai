import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  doc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

// Create a new chat instance
export const createChatInstance = async (userId, bookId, bookTitle) => {
  try {
    const chatRef = await addDoc(collection(db, 'chats'), {
      userId,
      bookId,
      bookTitle,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      messages: []
    });
    return chatRef.id;
  } catch (error) {
    console.error('Error creating chat instance:', error);
    throw error;
  }
};

// Get all chat instances for a user
export const getUserChats = async (userId) => {
  try {
    const chatsQuery = query(
      collection(db, 'chats'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(chatsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user chats:', error);
    throw error;
  }
};

// Update a chat instance with new messages
export const updateChatMessages = async (chatId, messages) => {
  try {
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      messages,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating chat messages:', error);
    throw error;
  }
}; 