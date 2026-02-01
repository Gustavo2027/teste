
import { ReactNode } from 'react';

export interface MenuItem {
  name: string;
  price: string;
  description?: string;
}

export interface MenuSection {
  title: string;
  icon: ReactNode;
  items: MenuItem[];
}

export type PageType = 'cover' | 'image' | 'content' | 'back';

export interface MenuPage {
  id: string;
  type: PageType;
  title?: string;
  footer?: string;
  imageUrl?: string;
  imageCaption?: string;
  sections?: MenuSection[];
}
