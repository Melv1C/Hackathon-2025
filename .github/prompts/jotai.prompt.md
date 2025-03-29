# Jotai Guidelines

Jotai is a minimalistic state management library that leverages atomic state for React. Follow these guidelines to keep your state management clean, scalable, and performant.

## 1. Define Atoms Outside Components
- **Singleton Atoms:** Define atoms at the module level to prevent re-creation on every render.
- **Modularization:** Organize atoms by domain or feature into separate files.

## 2. Keep Atoms Focused and Minimal
- **Minimal State:** Each atom should represent a small, focused piece of state.
- **Derived State:** Use computed atoms (getter-only atoms) to derive values rather than duplicating logic.

```tsx
import { atom } from 'jotai';

// Base atom representing a simple count
export const countAtom = atom(0);

// Derived atom that computes double the count
export const doubleCountAtom = atom((get) => get(countAtom) * 2);
```

## 3. Use the `useAtom` Hook in Components
- **Access and Update:** Utilize the `useAtom` hook to read and update atom state.
  
```tsx
import { useAtom } from 'jotai';
import { countAtom } from './atoms';

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
```

## 4. Utilize Atom Families for Dynamic State
- **Dynamic Atoms:** Use an atom family (or factories) when you need parameterized or dynamic state.
  
```tsx
import { atom } from 'jotai';

// Create a dynamic atom for managing state per item
export const itemAtomFamily = (id: string) => atom({ id, value: '' });
```

## 5. Combine Atoms with Custom Hooks
- **Encapsulate Logic:** Build custom hooks that combine multiple atoms for common patterns, keeping components clean and reusable.
  
```tsx
import { useAtom } from 'jotai';
import { countAtom, doubleCountAtom } from './atoms';

export function useCounter() {
  const [count, setCount] = useAtom(countAtom);
  const [doubleCount] = useAtom(doubleCountAtom);
  return { count, doubleCount, increment: () => setCount(c => c + 1) };
}
```

## 6. TypeScript Integration
- **Strong Typing:** Leverage TypeScript to define the shape of your state for improved reliability and developer experience.
  
```tsx
import { atom } from 'jotai';

interface User {
  id: string;
  name: string;
}

// Atom with a strongly-typed user state
export const userAtom = atom<User | null>(null);
```

## 7. Optimize Performance
- **Selective Subscriptions:** Split state into smaller atoms so that components subscribe only to the parts of state they need, reducing unnecessary re-renders.
- **Derived Atoms:** Use computed atoms to centralize and cache derived values.