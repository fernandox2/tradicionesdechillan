export interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    image: string;
    category: string[];
    author: {
        id: string;
        name: string;
    };
    createdAt?: string;
    updatedAt?: string;
  }