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
            description: 'Ontology-first graph memory and runtime for agents',
            customCss: ['./src/styles/custom.css'],
            plugins: [
                starlightBlog({
                    title: 'Blog',
                    navigation: 'none',
                    recentPostCount: 5,
                    authors: {
                        seocho: {
                            name: 'SEOCHO Core Engine',
                            title: 'System AI',
                        },
                    },
                })
            ],
            social: [
                { icon: 'github', label: 'GitHub', href: 'https://github.com/TTEON/seocho' }
            ],
            sidebar: [
                { label: 'Home', link: '/' },
                {
                    label: 'Understand', items: [
                        { label: 'Overview', link: '/docs/' },
                        { label: 'Concept Guide', link: '/learn/' },
                        { label: 'Why SEOCHO', link: '/docs/why_seocho/' },
                    ]
                },
                {
                    label: 'Start', items: [
                        { label: 'Quickstart', link: '/docs/quickstart/' },
                        { label: 'Python SDK Guide', link: '/docs/python_sdk/' },
                        { label: 'Bring Your Data', link: '/docs/apply_your_data/' },
                    ]
                },
                {
                    label: 'Build', items: [
                        { label: 'Run Specs', link: '/docs/run_specs/' },
                        { label: 'Tutorial', link: '/docs/tutorial/' },
                        { label: 'Examples', link: '/examples/' },
                        { label: 'Files and Artifacts', link: '/docs/files_and_artifacts/' },
                        { label: 'Architecture', link: '/docs/architecture/' },
                    ]
                },
                {
                    label: 'Operate', items: [
                        { label: 'Runtime Deployment', link: '/docs/runtime_deployment/' },
                        { label: 'Workflow', link: '/docs/workflow/' },
                        { label: 'Release & Community', link: '/docs/release_and_community_operations/' },
                        { label: 'Community', link: '/community/' },
                    ]
                },
                {
                    label: 'Reference', items: [
                        { label: 'SDK Overview', link: '/sdk/' },
                        { label: 'SDK Getting Started', link: '/sdk/getting-started/' },
                        { label: 'Ontology and Semantic Artifacts', link: '/sdk/ontology-guide/' },
                        { label: 'API Reference', link: '/sdk/api-reference/' },
                        { label: 'SDK Examples', link: '/sdk/examples/' },
                        { label: 'Philosophy', link: '/docs/philosophy/' },
                    ]
                },
                {
                    label: 'Contribute', items: [
                        { label: 'Open Source Playbook', link: '/docs/open_source_playbook/' },
                        { label: 'Changelog', link: '/changelog/' },
                    ]
                },
            ],
            head: [
                { tag: 'link', attrs: { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' } },
                { tag: 'meta', attrs: { property: 'og:image', content: 'https://seocho.blog/images/seocho-brand-graph.png' } },
                { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
                { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
                { tag: 'meta', attrs: { name: 'theme-color', content: '#030405' } },
            ],
        }),
    ],
});
