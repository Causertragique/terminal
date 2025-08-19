import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { normalizeLanguage } from './i18n';

interface Category {
  id: number;
  name: string;
  nameFr?: string;
  color?: string;
  language: string;
}

// Fonction pour récupérer les catégories depuis Firestore
async function fetchCategories(language: string = 'en'): Promise<Category[]> {
  try {
    // Données de test temporaires
    const mockCategories: Category[] = [
      {
        id: 1,
        name: 'File Management',
        nameFr: 'Gestion des fichiers',
        color: '#3b82f6',
        language: 'en'
      },
      {
        id: 2,
        name: 'File Management',
        nameFr: 'Gestion des fichiers',
        color: '#3b82f6',
        language: 'fr'
      },
      {
        id: 3,
        name: 'System',
        nameFr: 'Système',
        color: '#ef4444',
        language: 'en'
      },
      {
        id: 4,
        name: 'System',
        nameFr: 'Système',
        color: '#ef4444',
        language: 'fr'
      }
    ];
    
    // Filtrer par langue
    return mockCategories.filter(cat => cat.language === language);
    
    // Code Firestore commenté pour l'instant
    /*
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('language', '==', language), orderBy('name'));
    const querySnapshot = await getDocs(q);
    
    const categories: Category[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Category;
      categories.push({ ...data, id: parseInt(doc.id) });
    });
    
    return categories;
    */
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return [];
  }
}

export function useCategories(language: string = 'en') {
  const normalizedLanguage = normalizeLanguage(language);
  
  return useQuery({
    queryKey: ['categories', normalizedLanguage],
    queryFn: () => fetchCategories(normalizedLanguage),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}