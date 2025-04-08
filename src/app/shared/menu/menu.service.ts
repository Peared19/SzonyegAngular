// src/app/shared/menu/menu.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root' // ensures the service is globally available
})
export class MenuService {
  private actionSubject = new Subject<string>();
  action$ = this.actionSubject.asObservable();

  triggerAction(action: string) {
    this.actionSubject.next(action);
  }
}
