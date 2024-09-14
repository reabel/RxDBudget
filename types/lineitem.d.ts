/**
 * about .d.ts file https://www.typescriptlang.org/docs/handbook/2/type-declarations.html
 */

export interface LineItem {
    id: number;
    name: string;
    type: string;
    price: number;
    recurring?: boolean;
    quantity?: number;
    date? : Date;
}

export interface LineItemWithTotal extends LineItem {
    total: number;
}

export interface LineItems {
    items: LineItem[];
}