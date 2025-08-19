import React from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "../helpers/useTranslation";
import { useAuth } from "../helpers/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs";
import { PasswordLoginForm } from "../components/PasswordLoginForm";
import { PasswordRegisterForm } from "../components/PasswordRegisterForm";
import { Skeleton } from "../components/Skeleton";
import { Terminal } from "lucide-react";
import styles from "./login.module.css";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { authState } = useAuth();

  if (authState.type === "loading") {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Skeleton style={{ height: "2.5rem", width: "15rem", marginBottom: "var(--spacing-2)" }} />
            <Skeleton style={{ height: "1rem", width: "20rem" }} />
          </div>
          <Skeleton style={{ height: "2.5rem", width: "100%", marginTop: "var(--spacing-6)" }} />
          <Skeleton style={{ height: "15rem", width: "100%", marginTop: "var(--spacing-4)" }} />
        </div>
      </div>
    );
  }

  if (authState.type === "authenticated") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{t("login.pageTitle", "Login | Terminal Guide")}</title>
        <meta
          name="description"
          content={t(
            "login.metaDescription",
            "Log in or create an account to access the Terminal Command Reference Guide."
          )}
        />
      </Helmet>
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Terminal className={styles.logoIcon} size={40} />
            <h1 className={styles.title}>{t("login.welcomeTitle", "Welcome Back")}</h1>
            <p className={styles.description}>
              {t(
                "login.welcomeDescription",
                "Your go-to cheatsheet for terminal commands."
              )}
            </p>
          </div>

          <Tabs defaultValue="login" className={styles.tabsContainer}>
            <TabsList>
              <TabsTrigger value="login">{t("login.loginTab", "Log In")}</TabsTrigger>
              <TabsTrigger value="register">{t("login.registerTab", "Sign Up")}</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className={styles.tabContent}>
              <PasswordLoginForm />
            </TabsContent>
            <TabsContent value="register" className={styles.tabContent}>
              <PasswordRegisterForm />
            </TabsContent>
          </Tabs>

          <div className={styles.testCredentials}>
            <h3 className={styles.testCredentialsTitle}>
              {t("login.testCredentialsTitle", "For Development")}
            </h3>
            <p className={styles.testCredentialsText}>
              {t("login.testCredentialsEmail", "Email")}:{" "}
              <code>test@example.com</code>
            </p>
            <p className={styles.testCredentialsText}>
              {t("login.testCredentialsPassword", "Password")}:{" "}
              <code>Password123</code>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;