import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
    site: 'https://tteon.github.io',
    integrations: [
        tailwind({ applyBaseStyles: false }),
        starlight({
            title: 'SEOCHO',
            customCss: ['./src/styles/custom.css'],
            social: {
                github: 'https://github.com/tteon/seocho',
            },
            sidebar: [
                { label: 'Introduction', link: '/docs/intro/' },
                { label: 'Architecture', link: '/docs/architecture/' },
                { label: 'Quick Start', link: '/docs/quickstart/' },
            ],
        }),
    ],
});