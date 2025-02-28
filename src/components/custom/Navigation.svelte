<script lang="ts">
	interface ComponentData {
		class: string | undefined;
		content: {
			title: string;
			navigation_links: {
				text: string;
				link: string;
			}[];
			primary_buttons: {
				text: string;
				link: string;
			}[];
			secondary_buttons: {
				text: string;
				link: string;
			}[];
		};
	}
	interface Props {
		data: ComponentData;
	}

	let { data = $bindable() }: Props = $props();

	// console.log(JSON.stringify(data));

	if (data == undefined) {
		data = {
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
		};
	}
</script>

<nav
	class="absolute left-0 right-0 top-0 m-auto flex h-20 max-w-[80%] items-center justify-between border-b"
>
	<div class="flex items-center gap-2">
		<p>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="rounded-lg p-1 hover:bg-gray-200"
				width="32"
				height="32"
				fill="#000000"
				viewBox="0 0 256 256"
				><path
					d="M101.85,191.14C97.34,201,82.29,224,40,224a8,8,0,0,1-8-8c0-42.29,23-57.34,32.86-61.85a8,8,0,0,1,6.64,14.56c-6.43,2.93-20.62,12.36-23.12,38.91,26.55-2.5,36-16.69,38.91-23.12a8,8,0,1,1,14.56,6.64Zm122-144a16,16,0,0,0-15-15c-12.58-.75-44.73.4-71.4,27.07h0L88,108.7A8,8,0,0,1,76.67,97.39l26.56-26.57A4,4,0,0,0,100.41,64H74.35A15.9,15.9,0,0,0,63,68.68L28.7,103a16,16,0,0,0,9.07,27.16l38.47,5.37,44.21,44.21,5.37,38.49a15.94,15.94,0,0,0,10.78,12.92,16.11,16.11,0,0,0,5.1.83A15.91,15.91,0,0,0,153,227.3L187.32,193A16,16,0,0,0,192,181.65V155.59a4,4,0,0,0-6.83-2.82l-26.57,26.56a8,8,0,0,1-11.71-.42,8.2,8.2,0,0,1,.6-11.1l49.27-49.27h0C223.45,91.86,224.6,59.71,223.85,47.12Z"
				></path></svg
			>
		</p>
		<p>/</p>
		<p
			bind:textContent={data.content.title}
			contenteditable
			class="rounded-lg px-2 py-1 text-lg font-semibold hover:bg-gray-200"
		>
			{data.content.title}
		</p>
	</div>
	<div class="absolute left-[50%] flex w-fit translate-x-[-50%] items-center justify-center">
		<ul class="flex gap-1">
			{#if data.content.navigation_links}
				{#each data.content.navigation_links as link, index}
					<li>
						<a href="#{link.link}">
							<span
								bind:textContent={data.content.navigation_links[index].text}
								class="rounded-lg px-4 py-2 hover:bg-gray-200"
								contenteditable>{link.text}</span
							>
						</a>
					</li>
				{/each}
			{/if}
		</ul>
	</div>
	<div class="flex items-center gap-2">
		{#if data.content.secondary_buttons}
			{#each data.content.secondary_buttons as button, index}
				<a href="#{button.link}">
					<span
						bind:textContent={data.content.secondary_buttons[index].text}
						contenteditable
						class="rounded-lg px-4 py-2 hover:bg-gray-200">{button.text}</span
					>
				</a>
			{/each}
		{/if}
		{#if data.content.primary_buttons}
			{#each data.content.primary_buttons as button, index}
				<a href="#{button.link}" class="rounded-lg bg-gray-200 hover:bg-black hover:text-white">
					<p
						bind:textContent={data.content.primary_buttons[index].text}
						contenteditable
						class="px-4 py-1.5"
					>
						{button.text}
					</p>
				</a>
			{/each}
		{/if}
	</div>
</nav>
<div class="mb-20"></div>
