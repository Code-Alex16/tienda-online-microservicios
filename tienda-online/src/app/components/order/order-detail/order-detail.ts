import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { OrderService } from '../../../services/order';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true, 
  imports: [
    CommonModule 
  ],
  templateUrl: './order-detail.html',
  styleUrls: ['./order-detail.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order | undefined;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id_pedido = +params['id']; 
      if (id_pedido) {
        this.loadOrderDetails(id_pedido);
      } else {
        this.errorMessage = 'ID de pedido no proporcionado.';
      }
    });
  }

  loadOrderDetails(id_pedido: number): void {
    this.orderService.getOrderDetails(id_pedido).subscribe({
      next: (data: any) => {
        if (data && data.body) {
          const fetchedOrder: Order = data.body;
          fetchedOrder.total = typeof fetchedOrder.total === 'string' ? parseFloat(fetchedOrder.total) : fetchedOrder.total;

          if (fetchedOrder.detalles) {
            fetchedOrder.detalles = fetchedOrder.detalles.map(detail => ({
              ...detail,
              precio_unitario: typeof detail.precio_unitario === 'string' ? parseFloat(detail.precio_unitario) : detail.precio_unitario
            }));
          }
          this.order = fetchedOrder;
        } else {
          this.errorMessage = 'Detalles del pedido no encontrados.';
          this.order = undefined;
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al cargar los detalles del pedido.';
        this.order = undefined;
        console.error('Error al cargar detalles del pedido:', err);
      }
    });
  }
}