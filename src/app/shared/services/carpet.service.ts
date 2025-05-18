import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, collection, collectionData, doc, docData, query, where, getDocs, addDoc, DocumentData, CollectionReference } from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Carpet } from '../models/carpet.model';

@Injectable({
  providedIn: 'root'
})
export class CarpetService {

  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) { }

  getAllCarpets(): Observable<Carpet[]> {
    const carpetsCollection = collection(this.firestore, 'carpets');
    return collectionData(carpetsCollection, { idField: 'id' }).pipe(
      map(data => data as Carpet[])
    );
  }

  getFilteredCarpets(searchQuery = '', type = ''): Observable<Carpet[]> {
    const carpetsCollectionRef = collection(this.firestore, 'carpets');
    let q = query(carpetsCollectionRef);

    if (type) {
      q = query(q, where('type', '==', type));
    }

    return collectionData(q, { idField: 'id' }).pipe(
      map(carpetsData => {
        let carpets = carpetsData as Carpet[];

        if (searchQuery.trim() !== '') {
          const queryLower = searchQuery.toLowerCase().trim();
          carpets = carpets.filter(carpet =>
            (carpet as any).name.toLowerCase().includes(queryLower) ||
            (carpet as any).description.toLowerCase().includes(queryLower)
          );
        }
        return carpets;
      })
    );
  }

  getCarpetById(id: string): Observable<Carpet | undefined> {
    const carpetDocRef = doc(this.firestore, 'carpets', id);
    return docData(carpetDocRef, { idField: 'id' }).pipe(
      map(carpetData => (carpetData ? (carpetData as Carpet) : undefined))
    );
  }

  async uploadCarpetImage(file: File): Promise<string> {
    const filePath = `carpet_images/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error('Image upload failed:', error);
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          }).catch(reject);
        }
      );
    });
  }

  async addCarpet(carpet: Partial<Carpet>): Promise<void> {
    const carpetsCollection = collection(this.firestore, 'carpets');
    await addDoc(carpetsCollection, carpet);
  }
}
