# BETA STANDARDS
## Starting the Beta Process
* Begin by enabling the whole section in `/src/components/navbar.astro` under `<!-- Enable if it's a beta build -->`.
* If possible, rename the version in `/public/static/version.js` and add it's entry in `/src/pages/backup/archive.astro`. (ensure the latest tag gets moved)
* Make a pull request to the `beta` branch with the tag `update release` with `<version> Release` as it's title. (replace `<version>` with it's actual version)
## Near Release
* Start by making the bulletin slides with the Google Slides template.
* Make the changelog in `/src/pages/index.astro`. (if not done already in it's own pull request)
* Disable whole section in `/src/components/navbar.astro` under `<!-- Enable if it's a beta build -->`.
## Release
* Merge branches around release time inside the pull request.
* Make the release in the `main` branch after merging.
* Make [Discord](https://discord.gg/pgGfhDVrmS) and [Twitter](https://twitter.com/ATProductsLLC) bulletin. (if possible, schedule the Twitter post)
# MAINTENANCE STANDARDS
## Prior to Maintenance
* If possible, let people know about this by putting a `alert-dark` and `alert-dismissible` with the template below which is included on `/src/components/navbar.astro`. Include starting time, and ending time. 
  * Sometimes, maintenance mode gets enabled due to issues. Enable the alert for versions, or planned maintenance. Unplanned maintenance is fine to not enable the alert.
```
<div class="alert alert-dark alert-dismissible mb-0 fade show" role="alert">
  <strong>Title</strong> Description
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div> 
```
* Start to edit the `maintenance.html` file in the `backup` branch with information in the prior alert.
## Maintenance
* Edit the `main` branch's `netlify.toml` file starting with the line `# Enable if maintenance mode.` (Keep the comment, remove the comments for the elements)
## After Maintenance
* Reedit the `netlify.toml` file on the `main` branch to make the whole segment a comment, basically reverting the file. Then remove the alert on `/src/components/navbar.astro`.
