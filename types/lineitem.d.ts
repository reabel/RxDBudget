/**
 * about .d.ts file https://www.typescriptlang.org/docs/handbook/2/type-declarations.html
 */

export interface LineItem {
    id: string;
    name: string;
    type: string;
    price: number;
    quantity?: number;
}

export interface LineItemWithTotal extends LineItem {
    total: number;
}

export interface LiteItems {
    items: LineItem[];
}