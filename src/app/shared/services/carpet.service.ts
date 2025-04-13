import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Carpet } from '../models/carpet.model';

@Injectable({
  providedIn: 'root'
})
export class CarpetService {
  private carpets: Carpet[] = [
    new Carpet({
      id: '1',
      name: 'Persian Royal',
      description: 'Beautiful Persian carpet with traditional patterns.',
      price: 249.99,
      type: 'Persian',
      imageUrl: 'assets/images/persian-royal.jpg',
      inStock: true
    }),
    new Carpet({
      id: '2',
      name: 'Modern Geometric',
      description: 'Contemporary carpet with bold geometric patterns.',
      price: 129.99,
      type: 'Modern',
      imageUrl: 'assets/images/modern-geometric.jpg',
      inStock: true
    }),
    new Carpet({
      id: '3',
      name: 'Traditional Style',
      description: 'Classic carpet with elegant traditional design.',
      price: 179.99,
      type: 'Traditional',
      imageUrl: 'assets/images/traditional.jpg',
      inStock: true
    }),
    new Carpet({
      id: '4',
      name: 'Oriental Beauty',
      description: 'Exquisite oriental carpet with intricate patterns.',
      price: 299.99,
      type: 'Oriental',
      imageUrl: 'assets/images/oriental.jpg',
      inStock: false
    })
  ];

  constructor() { }

  getAllCarpets(): Observable<Carpet[]> {
    return of(this.carpets);
  }

  getFilteredCarpets(query = '', type = '', inStockOnly = false): Observable<Carpet[]> {
    // Start with all carpets
    let filtered = [...this.carpets];

    // Apply search query
    if (query.trim() !== '') {
      query = query.toLowerCase().trim();
      filtered = filtered.filter(carpet =>
        carpet.name.toLowerCase().includes(query) || 
        carpet.description.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (type) {
      filtered = filtered.filter(carpet => carpet.type === type);
    }

    // Apply stock filter
    if (inStockOnly) {
      filtered = filtered.filter(carpet => carpet.inStock);
    }

    return of(filtered);
  }

  getCarpetById(id: string): Observable<Carpet | undefined> {
    const carpet = this.carpets.find(c => c.id === id);
    return of(carpet);
  }
}
