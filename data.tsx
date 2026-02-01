
import React from 'react';
import { GlassWater, Martini, Beer, Wine, Utensils, Coffee } from 'lucide-react';
import { MenuPage } from './types';

export const MENU_PAGES: MenuPage[] = [
  {
    id: 'cover',
    type: 'cover',
    title: 'MENU',
    footer: 'Bem-vindo'
  },
  {
    id: 'v1',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?q=80&w=1000&auto=format&fit=crop',
    imageCaption: 'Alegria Brasileira'
  },
  {
    id: 'p1',
    type: 'content',
    sections: [
      {
        title: 'Doses',
        icon: <GlassWater size={20} />,
        items: [
          { name: 'Pinga 51', price: '4,00' },
          { name: 'Velho Barreiro', price: '4,00' },
          { name: 'Sagatiba', price: '5,00' },
          { name: 'Saquê', price: '6,00' },
          { name: 'Vodka (Caipiroska)', price: '5,00' },
          { name: 'Campari', price: '7,00' },
        ]
      },
      {
        title: 'Caipirinhas',
        icon: <Martini size={20} />,
        items: [
          { name: 'Pinga 51', price: '20,00' },
          { name: 'Velho Barreiro', price: '15,00' },
          { name: 'Sagatiba', price: '25,00' },
          { name: 'Saquê', price: '18,00' },
          { name: 'Vodka (Caipiroska)', price: '25,00' },
        ]
      },
      {
        title: 'Cervejas',
        icon: <Beer size={20} />,
        items: [
          { name: 'Skol / Brahma', price: '7,00' },
          { name: 'Brahma Malzbier', price: '9,00' },
          { name: 'Heineken', price: '10,00' },
          { name: 'Heineken sem álcool', price: '10,00' },
        ]
      }
    ]
  },
  {
    id: 'v2',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1000&auto=format&fit=crop',
    imageCaption: 'Vinhos & Chopp'
  },
  {
    id: 'p2',
    type: 'content',
    sections: [
      {
        title: 'Chopp',
        icon: <Beer size={20} />,
        items: [
          { name: 'Chopp Claro', price: '9,00', description: '330ML' },
          { name: 'Chopp Claro', price: '13,50', description: '500ML' },
          { name: 'Chopp Escuro', price: '30,00', description: 'Garrafa 1L' },
        ]
      },
      {
        title: 'Vinhos',
        icon: <Wine size={20} />,
        items: [
          { name: 'Vinho Tinto Seco/Suave', price: '8,00' },
          { name: 'Concha y Toro Meio Seco', price: '50,00' },
          { name: 'Periquita Meio Seco', price: '90,00' },
          { name: 'Santa Helena Chardonay', price: '52,00' },
        ]
      }
    ]
  },
  {
    id: 'v3',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1000&auto=format&fit=crop',
    imageCaption: 'Refrescância'
  },
  {
    id: 'p3',
    type: 'content',
    sections: [
      {
        title: 'Batidas',
        icon: <Martini size={20} />,
        items: [
          { name: 'Pinga 51 / Saquê', price: '20,00' },
          { name: 'Vodka (Caipiroska)', price: '25,00' },
          { name: 'Espanhola (Morango)', price: '18,00' },
        ]
      },
      {
        title: 'Bebidas não alcoólicas',
        icon: <GlassWater size={20} />,
        items: [
          { name: 'Água com/sem gás', price: '5,00' },
          { name: 'Coca-cola / Guaraná', price: '7,00' },
          { name: 'Coca-cola / Guaraná Zero', price: '7,00' },
          { name: 'Schweppes / H2O', price: '7,00' },
          { name: 'Água Tônica / Zero', price: '6,00' },
          { name: 'Pacote de Gelo (3kg)', price: '6,00' },
        ]
      }
    ]
  },
  {
    id: 'v4',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=1000&auto=format&fit=crop',
    imageCaption: 'Sucos Naturais'
  },
  {
    id: 'p4',
    type: 'content',
    sections: [
      {
        title: 'Suco Natural',
        icon: <GlassWater size={20} />,
        items: [
          { name: 'Laranja / Limão', price: '10,00' },
          { name: 'Melancia', price: '10,00' },
          { name: 'Jarra de Suco', price: '18,00' },
          { name: 'Suco de Uva', price: '15,00', description: 'Integral - Copo' },
          { name: 'Sucos Lata', price: '8,00', description: 'Del Valle' },
        ]
      },
      {
        title: 'Especiais',
        icon: <Coffee size={20} />,
        items: [
          { name: 'Copo de Leite Longo', price: '5,00' },
          { name: 'Café Expresso', price: '5,00' },
          { name: 'Espanhola Sem Álcool', price: '8,00' },
          { name: 'Especial Peruíbe II', price: '8,00', description: 'Sem álcool' },
        ]
      }
    ]
  },
  {
    id: 'v5',
    type: 'image',
    imageUrl: 'https://i.ibb.co/99h3wM28/porcao-de-camarao-frito.jpg',
    imageCaption: 'Nossas Porções'
  },
  {
    id: 'p5',
    type: 'content',
    sections: [
      {
        title: 'Porções',
        icon: <Utensils size={20} />,
        items: [
          { name: 'Batata Frita', price: '15,00', description: '200 gramas' },
          { name: 'Batata Frita', price: '20,00', description: '400 gramas' },
          { name: 'Camarão', price: '40,00', description: '250 gramas' },
          { name: 'Camarão', price: '55,00', description: '500 gramas' },
          { name: 'Isca de Peixe', price: '45,00', description: '500 gramas' },
          { name: 'Calabresa Acebolada', price: '18,00', description: '400 gramas' },
        ]
      }
    ]
  },
  {
    id: 'v6',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1504973960431-1c467e159aa4?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Lanches e Pratos'
  },
  {
    id: 'p6',
    type: 'content',
    sections: [
      {
        title: 'Lanches',
        icon: <Utensils size={20} />,
        items: [
          { name: 'Misto Quente/Frio', price: '10,00' },
          { name: 'Queijo Quente', price: '10,00' },
        ]
      },
      {
        title: 'Pratos Extras',
        icon: <Utensils size={20} />,
        items: [
          { name: 'Omelete com Queijo', price: '5,00' },
          { name: 'Ovo Frito/Cozido', price: '3,00' },
          { name: 'Filé de Frango', price: '5,00' },
          { name: 'Bife Grelhado', price: '9,00' },
        ]
      }
    ]
  },
  {
    id: 'back',
    type: 'back',
    title: 'Volte Sempre',
    footer: 'AFPESP Peruíbe II - Obrigado pela preferência'
  }
];
