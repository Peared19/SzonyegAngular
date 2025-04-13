// menuservice  navigaciora
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private actionSubject = new Subject<string>();
  action$ = this.actionSubject.asObservable();

  triggerAction(action: string) {
    this.actionSubject.next(action);
  }
}
