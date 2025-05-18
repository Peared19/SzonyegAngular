import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { Order } from '../models/order.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private ordersCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.ordersCollection = collection(this.firestore, 'orders');
  }
  async placeOrder(order: Order): Promise<void> {
    await addDoc(this.ordersCollection, order);
  }
  
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const q = query(this.ordersCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAt: data['createdAt']?.toDate ? data['createdAt'].toDate() : new Date()
      } as Order;
    });
  }
} 