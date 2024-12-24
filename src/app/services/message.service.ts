import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject, debounceTime, map } from 'rxjs';

export interface Message {
  id: string;
  page: number;
  row: number;
  link: string;
  location: string;
  date: Date;
  paragraphs: string[];
  isFavorite: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public messages: Message[] = [];

  private selectedMessageSubject = new BehaviorSubject<Message | null>(null);
  selectedMessage$ = this.selectedMessageSubject.asObservable();

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  // Update favorite status for a message in the list
  updateFavoriteStatus(messageId: string, isFavorite: boolean) {
    // Update in the messages list
    const currentMessages = this.messagesSubject.value;
    const updatedMessages = currentMessages.map((message) =>
      message.id === messageId ? { ...message, isFavorite } : message
    );
    this.messagesSubject.next(updatedMessages);

    // Also update the selected message if it's the one being modified
    const selectedMessage = this.selectedMessageSubject.value;
    if (selectedMessage && selectedMessage.id === messageId) {
      this.selectedMessageSubject.next({ ...selectedMessage, isFavorite });
    }
  }
  private favoriteUpdates = new Subject<{
    messageId: string;
    status: boolean;
  }>();

  constructor(private firestore: Firestore) {
    this.favoriteUpdates.pipe(
      debounceTime(500)
    ).subscribe(async ({ messageId, status }) => {
      try {
        // First, let's check if the document exists
        const messageRef = doc(this.firestore, 'prophecies', messageId);
        const docSnap = await getDoc(messageRef);

        if (!docSnap.exists()) {
          console.error('Document does not exist:', messageId);
          console.log('Available data:', docSnap);
          return;
        }

        // If we get here, we know the document exists
        console.log('Updating document:', messageId);
        console.log('Current document data:', docSnap.data());

        await updateDoc(messageRef, {
          isFavorite: status,
          lastModified: serverTimestamp()
        });

        console.log('Successfully updated document');
      } catch (error) {
        console.error('Failed to update favorite status:', error);
        // Log additional information about the attempted update
        console.log('Attempted to update message:', {
          messageId,
          status,
          collection: 'prophecies'
        });
      }
    });
  }


  toggleFavorite(messageId: string, newStatus: boolean) {
    // Verify we have a valid message ID before proceeding
    if (!messageId) {
      console.error('Cannot toggle favorite: Invalid message ID');
      return;
    }

    // Update local state for immediate UI feedback
    this.updateLocalFavoriteStatus(messageId, newStatus);

    // Queue the Firestore update
    this.favoriteUpdates.next({ messageId, status: newStatus });
  }

  private updateLocalFavoriteStatus(messageId: string, isFavorite: boolean) {
    const currentMessages = this.messagesSubject.value;
    if (!currentMessages?.length) return;

    // Update the local state while maintaining all other message properties
    const updatedMessages = currentMessages.map(message =>
      message.id === messageId ? { ...message, isFavorite } : message
    );
    this.messagesSubject.next(updatedMessages);
  }

  public getMessages(): Observable<Message[]> {
    const messagesRef = collection(this.firestore, 'prophecies');
    return collectionData(messagesRef, { idField: 'id' }) as Observable<
      Message[]
    >;
  }

  public getFilteredMessages(isFavorite: boolean): Observable<Message[]> {
    const messagesRef = collection(this.firestore, 'prophecies');
    const propheciesQuery = query(
      messagesRef,
      where('isFavorite', '==', isFavorite),
      orderBy('date', 'desc') // Most recent prophecies first
    );
    return collectionData(messagesRef, { idField: 'id' }) as Observable<
      Message[]
    >;
  }

  setSelectedMessage(message: Message) {
    this.selectedMessageSubject.next(message);
  }

  setMessages(messages: Message[]) {
    this.messagesSubject.next(messages);
  }
}
