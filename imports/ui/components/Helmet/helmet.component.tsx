import { Helmet } from '@dr.pogodin/react-helmet';
import React, { JSX } from 'react';

export interface HelmetProps {
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
 * @param {HelmetProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered Helmet component.
 */
export const HelmetComponent: React.FC<HelmetProps> = (
  props: HelmetProps,
): JSX.Element => {
  const {
    title,
    links = [],
    meta = [],
    themeColor = '#ffffff',
    href = window.location.href,
    name = 'AntHill',
  } = props;

  return (
    <Helmet
      title={title}
      link={[...links]}
      meta={[
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'google', content: 'notranslate' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
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
        { name: 'twitter:site', content: `@${name.toLowerCase()}` },
        { name: 'twitter:creator', content: `@${name.toLowerCase()}` },
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
