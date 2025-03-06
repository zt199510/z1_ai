import { getIsMobile } from '@/utils/platform';
import { FC, PropsWithChildren, ReactNode } from 'react';

interface ServerLayoutProps {
  Desktop: FC<PropsWithChildren>;
  Mobile: FC<PropsWithChildren>;
}

const ServerLayout = ({ Desktop, Mobile }: ServerLayoutProps): FC<PropsWithChildren> => {
  const ServerLayoutComponent: FC<PropsWithChildren> = ({ children }) => {
    const isMobile = getIsMobile();
    return isMobile ? <Mobile>{children}</Mobile> : <Desktop>{children}</Desktop>;
  };
  
  return ServerLayoutComponent;
};

ServerLayout.displayName = 'ServerLayout';

export default ServerLayout;
