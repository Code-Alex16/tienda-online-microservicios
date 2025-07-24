import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order';
import { Order } from '../../../models/order.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data: any) => {
        if (data && data.body) {
          this.orders = data.body.map((order: any) => ({
            ...order,
            total: typeof order.total === 'string' ? parseFloat(order.total) : order.total
          }));
        } else {
          this.orders = [];
        }
      },
      error: (err) => {
        console.error('Error al cargar pedidos:', err);
        alert(err.error?.message || 'Error al cargar el historial de pedidos.');
      }
    });
  }

  viewOrderDetails(id_pedido: number): void {
    this.router.navigate(['/orders', id_pedido]);
  }
}