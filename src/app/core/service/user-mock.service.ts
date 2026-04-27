import {Register} from '../models/Register';
import {Observable, of} from 'rxjs';
import { Login } from '../models/login';


export class UserMockService {

  register(user: Register): Observable<Object> {
    return of();
  }

  login(user: Login): Observable<String> {
    return of('fake-jwt-token');
  }
}
