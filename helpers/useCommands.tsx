import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { normalizeLanguage } from './i18n';

// Types pour les données Firestore
interface Command {
  id: number;
  name: string;
  nameFr?: string;
  description: string;
  descriptionFr?: string;
  categoryId: number;
  tags: string[];
  language: string;
  examples?: string[];
  examplesFr?: string[];
  command: string;
  context?: string;
  commonErrors?: string[];
  createdAt?: Date;
  example?: string;
  solutions?: string[];
  syntax?: string;
}

interface Category {
  id: number;
  name: string;
  nameFr?: string;
  color?: string;
  language: string;
}

// Fonction pour récupérer les commandes depuis Firestore
async function fetchCommands(
  searchQuery: string = '',
  selectedCategoryId: number | null = null,
  selectedTags: string[] = [],
  language: string = 'en'
): Promise<Command[]> {
  try {
    const commandsRef = collection(db, 'commands');
    let q = query(commandsRef, where('language', '==', language));
    
    if (selectedCategoryId) {
      q = query(q, where('categoryId', '==', selectedCategoryId));
    }
    
    const querySnapshot = await getDocs(q);
    let commands: Command[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Command;
      commands.push({ ...data, id: parseInt(doc.id) });
    });
    
    // Filtrage côté client pour la recherche et les tags
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      commands = commands.filter(cmd => 
        cmd.name.toLowerCase().includes(searchLower) ||
        (cmd.nameFr && cmd.nameFr.toLowerCase().includes(searchLower)) ||
        cmd.description.toLowerCase().includes(searchLower) ||
        (cmd.descriptionFr && cmd.descriptionFr.toLowerCase().includes(searchLower))
      );
    }
    
    if (selectedTags.length > 0) {
      commands = commands.filter(cmd => 
        selectedTags.some(tag => cmd.tags.includes(tag))
      );
    }
    
    return commands;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return [];
  }
}

// Fonction pour récupérer les catégories depuis Firestore
async function fetchCategories(language: string = 'en'): Promise<Category[]> {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('language', '==', language), orderBy('name'));
    const querySnapshot = await getDocs(q);
    
    const categories: Category[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Category;
      categories.push({ ...data, id: parseInt(doc.id) });
    });
    
    return categories;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return [];
  }
}

export function useCommands(
  searchQuery: string = '',
  selectedCategoryId: number | null = null,
  selectedTags: string[] = [],
  language: string = 'en'
) {
  const normalizedLanguage = normalizeLanguage(language);
  
  return useQuery({
    queryKey: ['commands', searchQuery, selectedCategoryId, selectedTags, normalizedLanguage],
    queryFn: () => fetchCommands(searchQuery, selectedCategoryId, selectedTags, normalizedLanguage),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCategories(language: string = 'en') {
  const normalizedLanguage = normalizeLanguage(language);
  
  return useQuery({
    queryKey: ['categories', normalizedLanguage],
    queryFn: () => fetchCategories(normalizedLanguage),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}