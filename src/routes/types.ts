// types.ts
import { LazyExoticComponent, ReactNode } from 'react';

export interface RouteConfig {
  path: string;
  component: LazyExoticComponent<React.ComponentType<any>>;
  exact?: boolean;
  roles?: string[]; // Array of required permissions
}

export interface TemplateProps {
  children: ReactNode;
}
