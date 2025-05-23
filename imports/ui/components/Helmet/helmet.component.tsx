import { Helmet } from '@dr.pogodin/react-helmet';
import React, { JSX } from 'react';

export interface IHelmetProps {
  title: string;
  links?: Array<{ rel: string; href: string }>;
  meta?: Array<{ name: string; content: string | undefined }>;
  themeColor?: string;
  href?: string;
  name?: string;
}

/**
 * HelmetComponent is a React functional component that uses the Helmet library
 * to manage the document head, including the title, links, and meta tags.
 *
 * @param {IHelmetProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered Helmet component.
 */
export const HelmetComponent: React.FC<IHelmetProps> = (
  props: IHelmetProps,
): JSX.Element => {
  const {
    title,
    links = [],
    meta = [],
    themeColor = '#ffffff',
    href = window.location.href,
    name = 'AntHill Dashboard',
  } = props;

  const appleSizes = [
    '180x180',
    '167x167',
    '152x152',
    '120x120',
    '76x76',
    '60x60',
    '57x57',
  ];

  const iconSizes = ['192x192', '128x128', '96x96', '32x32', '16x16'];

  const appleTouchIcons = appleSizes.map((sizes) => ({
    sizes,
    rel: 'apple-touch-icon',
    href: '/favicon.ico',
  }));

  const icons = iconSizes.map((sizes) => ({
    sizes,
    rel: 'icon',
    href: '/favicon.ico',
  }));

  return (
    <Helmet
      title={title}
      link={[
        { rel: 'canonical', href: window.location.href },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/favicon.ico' },
        ...appleTouchIcons,
        ...icons,
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-startup-image', href: '/favicon.ico' },
        { rel: 'apple-touch-icon-precomposed', href: '/favicon.ico' },
        { rel: 'mask-icon', href: '/favicon.ico', color: themeColor },
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        ...links,
      ]}
      meta={[
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'google', content: 'notranslate' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        { name: 'apple-mobile-web-app-title', content: title },
        { name: 'msapplication-TileColor', content: themeColor },
        { name: 'og:url', content: href },
        { name: 'og:type', content: 'website' },
        { name: 'og:site_name', content: name },
        { name: 'twitter:card', content: name },
        { name: 'twitter:title', content: title },
        { name: 'author', content: name },
        { name: 'application-name', content: name },
        { name: 'theme-color', content: themeColor },
        { name: 'og:title', content: title },
        { name: 'twitter:url', content: href },
        {
          name: 'twitter:site',
          content: `@${name.replace(/ /g, '_').toLowerCase()}`,
        },
        {
          name: 'twitter:creator',
          content: `@${name.replace(/ /g, '_').toLowerCase()}`,
        },
        { name: 'twitter:image:alt', content: title },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0',
        },
        ...meta,
      ]}
    />
  );
};
