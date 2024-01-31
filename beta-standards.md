# BETA STANDARDS
## Starting the Beta Process
* Begin by enabling the beta `<marque>` tag in `/src/components/navbar.astro` under `<!-- Enable if it's a beta build -->`.
* If possible, rename the version in `/public/static/version.js` and add it's entry in `/src/pages/backup/archive.astro`.
* Make a pull request to the `beta` branch with the tag `update release` with `<version> Release` as it's title. (Replace `<version>` with it's actual version)
## Near Release
* Start by making the bulletin slides with the Google Slides template.
* Make the changelog in `/src/pages/index.astro` (if not done already in it's own pull request).
## Release
* Merge branches around release time inside the pull request.
* Make the release in the `main` branch after merging.
* Make [Discord](https://discord.gg/pgGfhDVrmS)https://discord.gg/pgGfhDVrmS) and [Twitter](https://twitter.com/ATProductsLLC) bulletin. (If possible, schedule the Twitter post)
