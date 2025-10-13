import { defineStore } from 'pinia';
import type { Part, PartOrder } from '../types';

export const usePartStore = defineStore('part', {
  state: () => ({
    parts: [] as Part[],
    orders: [] as PartOrder[],
  }),

  getters: {
    allParts: (state) => state.parts,
    
    allOrders: (state) => state.orders,

    partById: (state) => (id: string) => {
      return state.parts.find(p => p.id === id);
    },

    lowStockParts: (state) => {
      return state.parts.filter(p => p.quantityInStock <= p.reorderLevel);
    },

    partsByCategory: (state) => (category: string) => {
      return state.parts.filter(p => p.category === category);
    },

    pendingOrders: (state) => {
      return state.orders.filter(o => o.status === 'pending' || o.status === 'ordered');
    },

    totalPartsValue: (state) => {
      return state.parts.reduce((total, part) => total + (part.cost * part.quantityInStock), 0);
    },
  },

  actions: {
    addPart(part: Omit<Part, 'id'>) {
      const newPart: Part = {
        ...part,
        id: crypto.randomUUID(),
      };
      this.parts.push(newPart);
      return newPart;
    },

    updatePart(id: string, updates: Partial<Omit<Part, 'id'>>) {
      const index = this.parts.findIndex(p => p.id === id);
      if (index !== -1) {
        this.parts[index] = { ...this.parts[index], ...updates } as Part;
      }
    },

    deletePart(id: string) {
      this.parts = this.parts.filter(p => p.id !== id);
    },

    adjustStock(partId: string, quantity: number) {
      const part = this.parts.find(p => p.id === partId);
      if (part) {
        part.quantityInStock += quantity;
      }
    },

    createOrder(order: Omit<PartOrder, 'id' | 'orderNumber'>) {
      const orderNumber = `ORD-${Date.now()}`;
      const newOrder: PartOrder = {
        ...order,
        id: crypto.randomUUID(),
        orderNumber,
      };
      this.orders.push(newOrder);
      return newOrder;
    },

    updateOrder(id: string, updates: Partial<Omit<PartOrder, 'id' | 'orderNumber'>>) {
      const index = this.orders.findIndex(o => o.id === id);
      if (index !== -1) {
        this.orders[index] = { ...this.orders[index], ...updates } as PartOrder;
      }
    },

    receiveOrder(orderId: string) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.status = 'received';
        order.actualDeliveryDate = new Date();
        
        // Update part quantities
        order.items.forEach(item => {
          this.adjustStock(item.partId, item.quantity);
        });
      }
    },

    cancelOrder(orderId: string) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.status = 'cancelled';
      }
    },

    // Initialize with sample data
    initSampleData() {
      this.parts = [
        {
          id: '1',
          partNumber: 'OIL-001',
          name: '5W-30 Synthetic Oil',
          description: 'Premium synthetic motor oil',
          category: 'Fluids',
          manufacturer: 'Mobil 1',
          cost: 25.00,
          retailPrice: 45.00,
          quantityInStock: 24,
          reorderLevel: 10,
          reorderQuantity: 20,
          supplier: 'Auto Parts Wholesale',
          location: 'Shelf A1',
        },
        {
          id: '2',
          partNumber: 'FILT-001',
          name: 'Oil Filter',
          description: 'Standard oil filter',
          category: 'Filters',
          manufacturer: 'Fram',
          cost: 8.00,
          retailPrice: 15.00,
          quantityInStock: 5,
          reorderLevel: 10,
          reorderQuantity: 25,
          supplier: 'Auto Parts Wholesale',
          location: 'Shelf B2',
        },
        {
          id: '3',
          partNumber: 'BRAKE-001',
          name: 'Brake Pads',
          description: 'Ceramic brake pads - front',
          category: 'Brakes',
          manufacturer: 'Wagner',
          cost: 45.00,
          retailPrice: 89.00,
          quantityInStock: 8,
          reorderLevel: 5,
          reorderQuantity: 10,
          supplier: 'Brake Supply Co',
          location: 'Shelf C3',
        },
      ];

      this.orders = [
        {
          id: '1',
          orderNumber: 'ORD-001',
          supplierId: 'SUP-001',
          supplierName: 'Auto Parts Wholesale',
          orderDate: new Date('2024-10-01'),
          expectedDeliveryDate: new Date('2024-10-08'),
          status: 'ordered',
          items: [
            {
              partId: '2',
              partNumber: 'FILT-001',
              partName: 'Oil Filter',
              quantity: 25,
              unitCost: 8.00,
              totalCost: 200.00,
            },
          ],
          totalCost: 200.00,
          notes: 'Restocking low inventory items',
        },
      ];
    },
  },
});
