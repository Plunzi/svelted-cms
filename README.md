# 🧪 Svelted CMS - ɴᴇxᴛ-ɢᴇɴ sᴠᴇʟᴛᴇ ᴄᴏᴍᴘᴏɴᴇɴᴛ ᴇᴅɪᴛᴏʀ

<h1 align="center">
  <img src="https://stats.plunzish.com/plunzi-logo.png" width="340" />
  <br />
  This repository contains the source for the Svelted CMS platform.
</h1>

Everything you need to build a fast, moderny and yet not so stable website project, powered by [`Svelte Kit`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).
This project is still very new and every contribution of code will be appreciated.
**Important!** This project requires [bun](https://bun.sh) as the runtime. If you do not currently have Bun installed,
please visit their website: [Official Bun Website](https://bun.sh).

Bun is a faster alternative to Node.js. Most, if not all, Node.js libraries you want to use should work fine in Bun as well! Since Bun consistently outperforms Node, we decided to use their exclusive imports.

## 🙋 Committers and Contributors
- [Plunzi](https://twitter.com/JustPlunzi) (maintainer, designer, developer)
- [joshnuss](https://twitter.com/joshnuss) (skilled developer)

Currently developed features:
> svelted admin dashboard (can be found under the route ``/svelted/``)
> simplistic block build editor (``/svelted/editor``)
> creating, deleting, saving layouts & pages (``/svelted/layouts`` | ``/svelted/pages``)
> adding new routes at runtime
> storage/media navigation (``/svelted/media``)

## 🚩 Setup project locally

First clone this repository to a place on your machine and execute the following commands for installing all packages.

```bash
# install required packages
bun install
```

```bash
# install required packages
bun run build && bun run start
```

## 📚 Additional Resources

Here are some additional resources which could be handy:

[Svelte Documentation](svelte.dev/docs)
[SvelteKit Documentation](kit.svelte.dev/docs)
[Bun Documentation](bun.sh/docs)

## 📝 Contributing

We welcome contributions! If you have suggestions for improving the project or want to report a bug, please open an issue. If you would like to contribute code, please fork the repository and submit a pull request.

## Developing

Done? Great, now you can install all required dependencies with `bun add`, start a development server:

```bash
bun --bun run dev

# or start the server and open the app in a new browser tab
bun --bun run dev -- --open
```