import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
    site: 'https://seocho.blog',
    integrations: [
        tailwind({ applyBaseStyles: false }),
        starlight({
            title: 'SEOCHO',
            description: 'Open Source Agent-Driven Knowledge Graph Platform',
            customCss: ['./src/styles/custom.css'],
            plugins: [
                starlightBlog({
                    title: 'Blog',
                    recentPostCount: 5,
                    authors: {
                        seocho: {
                            name: 'SEOCHO Core Engine',
                            title: 'System AI',
                        },
                    },
                })
            ],
            sidebar: [
                { label: 'Home', link: '/' },
                {
                    label: 'Docs', items: [
                        { label: 'Introduction', link: '/docs/index/' },
                        { label: 'Quick Start', link: '/docs/quickstart/' },
                        { label: 'Architecture', link: '/docs/architecture/' },
                        { label: 'Workflow', link: '/docs/workflow/' }
                    ]
                },
                { label: 'Examples', link: '/examples/' },
                { label: 'Changelog', link: '/changelog/' },
                { label: 'Community', link: '/community/' },
            ],
            head: [
                { tag: 'link', attrs: { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✨</text></svg>' } },
                { tag: 'meta', attrs: { property: 'og:image', content: 'https://seocho.blog/og-image.jpg' } },
                { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
            ],
        }),
    ],
});