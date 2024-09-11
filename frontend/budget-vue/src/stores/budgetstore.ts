import { defineStore } from "pinia";
//replace with @ syntax later
import { LineItem } from '../../../../types/lineitem';

export const useBudgetStore = defineStore("budget", {
  state: () => {
    return {
      lineItems: Array<LineItem>(),
      displayForm: false,
    };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    addLineItem(item: any) {
      this.lineItems.push(item);
    },
    toggleDisplayForm() {
      console.log("toggleDisplayForm", this.displayForm);
      this.displayForm = !this.displayForm;
    },
    formatAsCSV() {
      let csv = "ID,Name,Type,Price,Quantity,Recurring,Date\n";
      this.lineItems.forEach((item) => {
        csv += `${item.id},${item.name},${item.type},${item.price},${item.quantity},${item.recurring},${item.date}\n`;
      });
      return csv;
    }
  },
});
