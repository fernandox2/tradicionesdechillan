export interface Order {
    id:            string;
    subTotal:      number;
    tax:           number;
    total:         number;
    itemsInOrder:  number;
    isPaid:        boolean;
    paidAt?:       Date | String | null;
    createdAt:     Date;
    updatedAt:     Date;
    userId:        string;
    transactionId: null;
    OrderItem:     OrderItem[];
    OrderAddress:  OrderAddress;
}

interface OrderAddress {
    id:         string;
    firstName:  string;
    lastName:   string;
    address:    string;
    address2:   string;
    postalCode: string;
    phone:      string;
    city:       string;
    countryId:  string;
    orderId:    string;
}

interface OrderItem {
    id:        string;
    quantity:  number;
    price:     number;
    size:      string;
    orderId:   string;
    productId: string;
    product:   ProductInOrder;
}

interface ProductInOrder {
    id:           string;
    title:        string;
    description:  string;
    inStock:      number;
    price:        number;
    sizes:        string[];
    slug:         string;
    tags:         string[];
    gender:       string;
    categoryId:   string;
    ProductImage: ProductImage[];
}

interface ProductImage {
    url: string;
}
