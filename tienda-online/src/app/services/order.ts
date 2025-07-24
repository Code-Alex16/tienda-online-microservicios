import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, OrderDetail } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/usuarios-secure/pedidos`);
  }

  getOrderDetails(id_pedido: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/usuarios-secure/pedidos/${id_pedido}`);
  }
}