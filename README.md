# Link Engine

A tool for providing a list of links (e.g. to students) without needing to go through the painfully slow process of adding them in HTML.

The list of links is searchable; the search uses n-grams so it's quite fuzzy and helpful.

Local Storage for recently visited link pages

Secret URLs for link pages

Original Idea and above features by Rich Boakes, https://github.com/ear1grey.

## My Contribution

1. Drag and Drop interface for editing the link page.

2. User Login (normal and google auth) and landing page.

3. Storing user made url pages on the cloud.

4. Allowing collaboration on link pages and auth decisions (viewer, owner, editor).

5. Better customisability of links (auto color coordinated URL types upon selection).

## Stack

1. Firebase Auth/Database/Functions/Hosting
2. GCP Cloud Bucket for JSON storage.
3. Vanilla JS, HTML, CSS for actual link page.
4. React TailwindCSS and Framer Motion for landing page.
5. Webpack to put it all together.

## Why did I do it this way?

At the beginning, I naively continued using vanilla JS, HTML and CSS to build upon the once small project when I began. It got hard to manage and now that I decided to finish it off I'd rather use better tools.

Therefore, I used webpack to strap react and original html together for my landing page to use more mature animation packages.
