<script lang="ts">
	// layout component imports
	import components from '$components';
	export let data;

	let layout_blocks = data.page.content || [
		{
			icon: 'Cube',
			name: 'Navigation',
			component: 'BLOCK_Navigation',
			data: {
				class: 'undefined',
				content: {
					title: 'Hello Svelted User!',
					navigation_links: [
						{
							text: 'Home',
							link: '/'
						},
						{
							text: 'About',
							link: '/about'
						},
						{
							text: 'Blog',
							link: '/blog'
						},
						{
							text: 'Contact',
							link: '/contact'
						}
					],
					primary_buttons: [
						{
							text: 'Get Started',
							link: '/get-startet'
						}
					],
					secondary_buttons: [
						{
							text: 'Log In',
							link: '/login'
						}
					]
				}
			}
		},
		{
			icon: 'Cube',
			name: 'Heading',
			component: 'BLOCK_Heading1',
			data: { class: 'text-2xl', content: 'Hello User!' }
		},
		{
			icon: 'Cube',
			name: 'Paragraph',
			component: 'BLOCK_Paragraph',
			data: { class: 'text-lg', content: 'Welcome to svelted visual editor!' }
		}
	];
</script>

<main>
	{#each layout_blocks as block, index}
		<div class="contents">
			<svelte:component this={components[block.component]} data={block.data} />
        </div>
	{/each}
</main>
