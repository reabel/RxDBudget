import { defineStore } from 'pinia';
//replace with @ syntax later
//import { LineItem } from '../../../../types/lineitem';

export const useBudgetStore = defineStore('budget', {
  state: () => {
    return { lineItems: [
        {id: 1, name: 'Item 1', type: 'expense', price: 100, quantity: 1, recurring: true, date: '2021-01-01'},
        {id: 2, name: 'Item 2', type: 'expense', price: 200, quantity: 1},
    ] }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    addLineItem(item: any) {
      this.lineItems.push(item);
    },
  },
})