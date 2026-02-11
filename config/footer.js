module.exports = (copyright, trademark) => ({
    links: [
        {
            title: 'Docs',
            items: [
                {
                    label: 'Document',
                    to: '/eloqkv/introduction',
                },
                {
                    label: 'Product',
                    to: '/product/eloqkv',
                },
            ],
        },
        {
            title: 'Community',
            items: [
                {
                    label: 'Stack Overflow',
                    href: 'https://stackoverflow.com/questions/tagged/eloqdb',
                },
                {
                    label: 'Discord',
                    href: 'https://discord.gg/nmYjBkfak6',
                },
            ],
        },
        {
            title: 'More',
            items: [
                {
                    label: 'Blog',
                    to: '/blog',
                },
                {
                    label: 'News',
                    to: '/news',
                },
            ],
        },
    ],
    logo: {
        alt: 'EloqData Logo',
        src: 'img/eloqdata_logo.png',
        href: 'https://www.eloqdata.com/',
    },
    copyright: `${copyright}<br/>${trademark}`,
});
