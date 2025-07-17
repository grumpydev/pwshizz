Install the playwright mcp from https://github.com/microsoft/playwright-mcp
Run "npm install"
Run "npx playwright install" - this will download and install the various browsers playwright needs

Note: samples are targetted at SiaB

On the day:

* Create a <team lead>-notes.txt file - dump in things that worked, things that didn't general learnings
* Watch out for cursor adding "Accept: application/json" into tests, it breaks everything!
* I had issues on my desktop with it sometimes hanging when running terminal commands - seems to be an xplat cursor bug, but hasn't affected my laptop - someone suggested telling cursor to "wrap all powershell in a temporary ps1 and execute that" may fix it, but ymmv