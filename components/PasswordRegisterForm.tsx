import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './Button';
import { Input } from './Input';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from './Form';
import { Spinner } from './Spinner';
import { useAuth } from '../helpers/useAuth';
import styles from './PasswordRegisterForm.module.css';

const schema = z.object({
  displayName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof schema>;

interface PasswordRegisterFormProps {
  className?: string;
}

export const PasswordRegisterForm: React.FC<PasswordRegisterFormProps> = ({
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schema),
  });

  const handleSubmit = async (data: RegisterFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      await register(data.email, data.password, data.displayName);
      setTimeout(() => navigate("/"), 200);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err instanceof Error ? err.message : "Échec de l'inscription. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={`${styles.form} ${className || ""}`}
      >
        {error && <div className={styles.errorMessage}>{error}</div>}

        <FormItem name="displayName">
          <FormLabel>Nom d'affichage</FormLabel>
          <FormControl>
            <Input
              placeholder="Votre nom"
              type="text"
              autoComplete="name"
              disabled={isLoading}
              {...form.register("displayName")}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem name="email">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              placeholder="votre@email.com"
              type="email"
              autoComplete="email"
              disabled={isLoading}
              {...form.register("email")}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem name="password">
          <FormLabel>Mot de passe</FormLabel>
          <FormControl>
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isLoading}
              {...form.register("password")}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem name="confirmPassword">
          <FormLabel>Confirmer le mot de passe</FormLabel>
          <FormControl>
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isLoading}
              {...form.register("confirmPassword")}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <Button
          type="submit"
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? (
            <span className={styles.loadingText}>
              <Spinner className={styles.spinner} size="sm" />
              Inscription en cours...
            </span>
          ) : (
            "S'inscrire"
          )}
        </Button>
      </form>
    </Form>
  );
};
