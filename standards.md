# BETA STANDARDS
## Starting the Beta Process
* If possible, rename the version in `/public/static/version.js` and add its entry in `/src/pages/backup/archive.astro`. (ensure the latest tag gets moved)
* Rename the version in `package.json`.
* Make a pull request to the `beta` branch with the tag `update release` with `<version> Release` as its title. (replace `<version>` with its actual version)
 * Please use a similar template to other release PRs.
## Near Release
* Start by making the bulletin slides with the Google Slides template.
* Make the changelog in `/src/pages/index.astro`. (if not done already in its own pull request)
* Disable the whole section in `/src/components/navbar.astro` under `<!-- Enable if it's a beta build -->`.
## Release
* Merge branches around release time inside the pull request.
* Make the release in the `main` branch after merging.
* Make [Discord](https://discord.gg/pgGfhDVrmS) and [Twitter](https://twitter.com/ATProductsLLC) bulletin. (if possible, schedule the Twitter post)
# MAINTENANCE STANDARDS
## Prior to Maintenance
* If possible, let people know about this, enabling either `alert-1.js` or `alert-2.js`, both in `/public/static/`. Include the starting time and the ending time. 
  * Sometimes, maintenance mode gets enabled due to issues. Enable the alert for versions or planned maintenance. Unplanned maintenance is acceptable to not allow the alert.
* Start to edit the `maintenance.astro` file in the `other` branch with information in the prior alert.
## Maintenance
* Edit the `main` branch's `netlify.toml` file starting with the line `# Enable if maintenance mode.` (Keep the comment, remove the comments for the elements)
## After Maintenance
* Reedit the `netlify.toml` file on the `main` branch to make the whole segment a comment, basically reverting the file. Then remove the alert on `/src/components/navbar.astro`.
