import { Injectable, Logger } from '@nestjs/common';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
}

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  async getProducts(): Promise<Product[]> {
    const hygraphEndpoint = process.env.HYGRAPH_ENDPOINT;
    const hygraphToken = process.env.HYGRAPH_TOKEN;

    if (!hygraphEndpoint) {
      this.logger.warn('HYGRAPH_ENDPOINT not set, returning fallback products');
      return this.getFallbackProducts();
    }

    const query = `
      query Products {
        products {
          id
          name
          price
          image {
            url
          }
          category
          isNew
        }
      }
    `;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (hygraphToken) {
        headers['Authorization'] = `Bearer ${hygraphToken}`;
      }

      const response = await fetch(hygraphEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query }),
      });

      const { data, errors } = await response.json();

      if (errors) {
        this.logger.error('Hygraph errors', JSON.stringify(errors));
        return this.getFallbackProducts();
      }

      return (data?.products ?? []).map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image?.url || this.getFallbackImage(p.name),
        category: p.category ?? 'all',
        isNew: p.isNew ?? false,
      }));
    } catch (err) {
      this.logger.error('Failed to fetch from Hygraph', err);
      return this.getFallbackProducts();
    }
  }

  private getFallbackImage(name: string): string {
    const map: Record<string, string> = {
      'Air Max 97': '/top-1.png',
      'React Presto': '/top-2.png',
      'KD13 EP': '/top-3.png',
      'AIR JORDAN 1 MID LIGHT SMOKE GREY': '/new-1.png',
      'Air Max 200 SE': '/new-2.png',
      'Discounted Shoe 1': '/discounted-1.png',
      'Discounted Shoe 2': '/discounted-2.png',
    };
    return map[name] ?? '/top-1.png';
  }

  private getFallbackProducts(): Product[] {
    return [
      // {
      //   id: '1',
      //   name: 'Air Max 97',
      //   price: 20.99,
      //   image: '/top-1.png',
      //   category: 'all',
      //   isNew: false,
      // },
      // {
      //   id: '2',
      //   name: 'React Presto',
      //   price: 20.99,
      //   image: '/top-2.png',
      //   category: 'all',
      //   isNew: false,
      // },
      // {
      //   id: '3',
      //   name: 'KD13 EP',
      //   price: 20.99,
      //   image: '/top-3.png',
      //   category: 'all',
      //   isNew: false,
      // },
      // {
      //   id: '4',
      //   name: 'AIR JORDAN 1 MID LIGHT SMOKE GREY',
      //   price: 129.99,
      //   image: '/new-1.png',
      //   category: 'all',
      //   isNew: true,
      // },
      // {
      //   id: '5',
      //   name: 'Air Max 200 SE',
      //   price: 99.99,
      //   image: '/new-2.png',
      //   category: 'all',
      //   isNew: true,
      // },
      // {
      //   id: '6',
      //   name: 'Discounted Shoe 1',
      //   price: 79.99,
      //   image: '/discounted-1.png',
      //   category: 'all',
      //   isNew: false,
      // },
      // {
      //   id: '7',
      //   name: 'Discounted Shoe 2',
      //   price: 89.99,
      //   image: '/discounted-2.png',
      //   category: 'all',
      //   isNew: false,
      // },
    ];
  }
}
