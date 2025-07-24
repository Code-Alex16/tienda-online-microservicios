export interface Order {
  id_pedido: number;
  fecha_pedido: string;
  total: number;
  estado: string;
  detalles?: OrderDetail[];
}

export interface OrderDetail {
  id_detalle_pedido: number;
  id_producto: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
}