export interface Product {
    id: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: Size[];
    slug: string;
    tags: string[];
    title: string;
    //todo: type: ValidTypes;
    gender: Category | null;
}

export interface CartItem {
    product: Product;
    quantity: number;
    size: Size;
}

export interface CartProduct {
    id: string;
    slug: string;
    title: string;
    price: number;
    quantity: number;
    size: Size;
    image: string;
  }

export interface ProductImage {
    id: number;
    url: string;
    productId: string;
  }

type Category = 'men'|'women'|'kid'|'unisex';
export type Size = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL'|'NINE_HUNDRED_GRAMS'|'FOUR_HUNDRED_FIFTY_GRAMS'|'TWO_HUNDRED_FIFTY_GRAMS';
export type ValidTypes = 'shirts'|'pants'|'hoodies'|'hats';