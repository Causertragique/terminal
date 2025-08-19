import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { GlobalContextProviders } from "./components/_globalContextProviders";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Page_0 from "./pages/_index.tsx";
import PageLayout_0 from "./pages/_index.pageLayout.tsx";
import Page_1 from "./pages/practice.tsx";
import PageLayout_1 from "./pages/practice.pageLayout.tsx";
import Page_2 from "./pages/quiz.tsx";
import PageLayout_2 from "./pages/quiz.pageLayout.tsx";
import Page_3 from "./pages/login.tsx";
import PageLayout_3 from "./pages/login.pageLayout.tsx";

if (!window.requestIdleCallback) {
  window.requestIdleCallback = function (callback: IdleRequestCallback, options?: IdleRequestOptions): number {
    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() % 50)),
      });
    }, 1);
  };
}

import "./base.css";

const fileNameToRoute = new Map([["./pages/_index.tsx","/"],["./pages/practice.tsx","/practice"],["./pages/quiz.tsx","/quiz"],["./pages/login.tsx","/login"]]);
const fileNameToComponent = new Map<string, React.ComponentType>([
    ["./pages/_index.tsx", Page_0],
["./pages/practice.tsx", Page_1],
["./pages/quiz.tsx", Page_2],
["./pages/login.tsx", Page_3],
  ]);

function makePageRoute(filename: string) {
  const Component = fileNameToComponent.get(filename);
  if (!Component) return null;
  return React.createElement(Component);
}

function toElement({
  trie,
  makePageRoute,
}: {
  trie: LayoutTrie;
  fileNameToRoute: Map<string, string>;
  makePageRoute: (filename: string) => React.ReactNode;
}) {
  return [
    ...trie.topLevel.map((filename) => (
      <Route
        key={fileNameToRoute.get(filename)}
        path={fileNameToRoute.get(filename)}
        element={makePageRoute(filename)}
      />
    )),
    ...Array.from(trie.trie.entries()).map(([Component, child], index) => (
      <Route
        key={index}
        element={
          <Component>
            <Outlet />
          </Component>
        }
      >
        {toElement({ trie: child, fileNameToRoute, makePageRoute })}
      </Route>
    )),
  ];
}

type LayoutTrieNode = Map<
  React.ComponentType<{ children: React.ReactNode }>,
  LayoutTrie
>;
type LayoutTrie = { topLevel: string[]; trie: LayoutTrieNode };
function buildLayoutTrie(layouts: {
  [fileName: string]: React.ComponentType<{ children: React.ReactNode }>[];
}): LayoutTrie {
  const result: LayoutTrie = { topLevel: [], trie: new Map() };
  Object.entries(layouts).forEach(([fileName, components]) => {
    let cur: LayoutTrie = result;
    for (const component of components) {
      if (!cur.trie.has(component)) {
        cur.trie.set(component, {
          topLevel: [],
          trie: new Map(),
        });
      }
      cur = cur.trie.get(component)!;
    }
    cur.topLevel.push(fileName);
  });
  return result;
}

function NotFound() {
  return (
    <div>
      <h1>Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <p>Go back to the <a href="/" style={{ color: 'blue' }}>home page</a>.</p>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <GlobalContextProviders>
        <ErrorBoundary>
          <Routes>
            {toElement({ trie: buildLayoutTrie({
"./pages/_index.tsx": PageLayout_0,
"./pages/practice.tsx": PageLayout_1,
"./pages/quiz.tsx": PageLayout_2,
"./pages/login.tsx": PageLayout_3,
}), fileNameToRoute, makePageRoute })} 
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </GlobalContextProviders>
    </BrowserRouter>
  );
}

