# Link Engine

A tool for providing a list of links (e.g. to students) without needing to go through the painfully slow process of adding them in HTML.

The list of links is searchable; the search uses n-grams so it's quite fuzzy and helpful.

## How To Add/Edit A Module

1. create a data file in `src/`  (see `src/template.json`)
2. add links with the following properties
  * `text`
  * `href`
  * `type` – can be anything, CSS has colours for _worksheet, slides, resource, example, source, information_
  * `keywords` – these are not displayed, but used for search
  * `pub` – whether or when to publish the link
    * `true` means the link will be included
    * a string date (e.g. `"2019-09-14"`) from which the link will be included
    * use `false` to put a link in before you're ready to release it
3. run `npm start` to publish the links
  * this will _compile_ your data files into files in `docs/data/`
  * the compiled files use hashed file names so they are not discoverable
  * the output of the script lists the hashed file names for every input name
    * e.g. `writing template.json into a57146dc.json`
4. git commit and push
5. test using `npm test` then in a browser visit `http://127.0.0.1:8080/#hash` where hash is the has that you see in the build output.

## To View On Public Domain

1. For a 100% working domain, use 'https://linkshares.web.app/#60b33197' this is a specific link page.

1.1. The domain is currently propogating to 'www.link-share.co.uk/#60b33197' and will be available when these documents are read.

2. To view with owner privileges, I have granted rich.boakes@port.ac.uk access to this specific link page.

## To Edit Links

1. Double click on the "Types" to open the link.

2. Double click on headers and page title to edit them and then press enter to save.

3. Drag and Drop to move elements around within the main page.

4. To delete panels, drop them into the bin. But to delete multiple panels, drop the header above them into the bin and choose whether to delete panels beneath.

## Making new link pages

1. This file will go to the corresponding number to the user dashboard visible at /dashboard.html (must be logged in).

2. Login, and type /?newFile=1 at the end of the URL, this will initiate a new link page with unique ID and change the file elements hyperlink in the dashboard.

## Known Issues

1. Leaving a header with no panel underneath will cause the header to be deleted.

2. Drag and dropping external elements into the main link list, will add NULL to the list.

3. Drag and dropping URLs inside the editable panel conflicts with the main dropping functionality.

4. Caching files is disabled for now (sw.js), as it was causing persisting issues during development and wasn't accounted for.

5. Entering the website at the bare URL will not load the dashboard or link page. You must enter /dashboard.html to view the dashboard.

6. Panel IDs are intigers and - values, this means that we have to select using attribute selectors '[id= "-1"]' to conform to link engines searching.

7. CSS is not clean and ordered, this is due to the time constraints of the project.

## Local development commands

0. The public domain is available at https://linkshares.web.app/#60b33197. However, for local development it is: 
1. To start client files "npm run startclient"
2. To start firebase local server run "npm run startserver"