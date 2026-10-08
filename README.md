# Pervez Ali: academic website

This folder is a complete, ready-to-publish website. It is plain HTML and CSS
with a little JavaScript: no build step, no software to install, and no
accounts needed except for hosting.

```
pervez-ali-website/
├── index.html      All the text on the site. This is the file you will edit.
├── styles.css      Colours, fonts and layout. Rarely needs changes.
├── script.js       Small extras: phone menu, Copy buttons, CV button.
├── demo.js         The interactive sampler demo in the Research section.
├── README.md       This guide.
└── assets/
    ├── images/     Your photo (when added), icons, sharing image, artwork.
    ├── cv/         Put your CV here as Pervez_Ali_CV.pdf.
    └── fonts/      The site's fonts. Leave these as they are.
```

**Contents**

1. [Preview the site on your computer](#1-preview-the-site-on-your-computer)
2. [Replace the placeholders](#2-replace-the-placeholders)
3. [Add your photo](#3-add-your-photo)
4. [Add your CV](#4-add-your-cv)
5. [Add a new publication](#5-add-a-new-publication)
6. [Other common edits](#6-other-common-edits)
7. [Publish on GitHub Pages](#7-publish-on-github-pages)
8. [Upload an updated version later](#8-upload-an-updated-version-later)
9. [Troubleshooting](#9-troubleshooting)
10. [Checklist before publishing](#10-checklist-before-publishing)

---

## 1. Preview the site on your computer

**Choose a text editor.** Use a plain-text code editor. [Visual Studio Code](https://code.visualstudio.com/)
is free and highlights mistakes such as a missing `>`. Do not use Word. On a Mac,
TextEdit can show HTML as a formatted page instead of code, so VS Code is easier.

**Quick preview.** Double-click `index.html`. It opens in your web browser.
After each change: save the file, then refresh the browser (Ctrl+R on Windows,
Cmd+R on Mac).

One difference in this mode: the "Download CV" button is always shown, because
a browser cannot check whether a file exists when a page is opened this way.

**Exact preview (recommended before publishing).** This runs a small local web
server, so the page behaves exactly as it will online. Python is needed; it is
already installed on most Macs.

- **Mac:** open the Terminal app, type `cd ` (with a space), drag the
  `pervez-ali-website` folder onto the Terminal window, and press Return. Then run:
  ```
  python3 -m http.server 8000
  ```
- **Windows:** open the folder in File Explorer, click the address bar, type
  `cmd` and press Enter. Then run:
  ```
  py -m http.server 8000
  ```
  (If that fails, try `python -m http.server 8000`, or install Python from
  [python.org](https://www.python.org/downloads/).)

Now open <http://localhost:8000> in your browser. To stop the server, click the
Terminal/command window and press Ctrl+C.

If a change to `styles.css` does not appear, do a hard refresh:
Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac).

---

## 2. Replace the placeholders

Anything still to be filled in appears on the page with a **yellow highlight**.
In `index.html` it looks like this:

```html
Dissertation: <span class="placeholder">[Dissertation title]</span>
```

Replace the whole `<span …>…</span>`, including the tags, with your text:

```html
Dissertation: Non-Reversible Langevin Dynamics for Unconstrained and Constrained Sampling
```

**To find them all,** open `index.html` and search (Ctrl+F or Cmd+F) for
`placeholder`. Every editable area is also marked with a comment that starts
with `EDIT:`; search for `EDIT:` to jump between sections.

### Placeholders in this version

All placeholders from the first version have been filled in or hidden. The
"Work in progress" list under Publications is hidden inside a comment; remove
the comment markers to show it again. To check for anything still highlighted,
search `index.html` for `class="placeholder"`.

### Where each piece of information lives

Most information appears only once, so you only need to change it in one place.

| Information | Section of `index.html` |
|---|---|
| Name, "PhD Candidate in …", university | INTRODUCTION (`<h1>` and the two lines below it) |
| Introduction paragraph | INTRODUCTION, `class="hero-intro"` |
| "Seeking postdoctoral opportunities starting …" | INTRODUCTION, `class="availability"` |
| Research overview and the three themes | RESEARCH |
| Publications, with a short summary of each paper | PUBLICATIONS |
| Short biography, education, honors | ABOUT |
| Courses | TEACHING |
| Email, postal address, profile links | CV AND CONTACT |
| Page title and description (search results, browser tab) | Top of the file, inside `<head>` |

Three things necessarily repeat in the `<head>` at the top of the file: your
name (page title, sharing title), the one-line description (for search engines
and for sharing), and the site address, `https://pervezali1.github.io` (three lines marked
`<!-- address -->`). If any of these ever changes, use your editor's
**Replace All** so nothing is missed.

### Safe-editing tips

- Change only the text **between** tags. Keep everything inside `< >`.
- Write `&amp;` for an ampersand (&) in addresses and text.
- `&nbsp;` is a space that never breaks a line; it keeps "July 2027" together.
- Make one change, save, refresh, check. If something breaks, undo (Ctrl+Z / Cmd+Z).

---

## 3. Add your photo

1. Choose a square photo with your face near the centre, at least 600 × 600 pixels.
2. Save it as a JPG named exactly **`profile.jpg`** (all lowercase).
3. Put it in `assets/images/`.

Refresh the page: the photo appears inside the circle and replaces the
initials. No code changes are needed. To remove it, delete the file.

- Keep the file small (under about 300 KB). Resizing to 800 × 800 pixels is plenty.
- Files from phones are sometimes `.HEIC` or `.jpeg`. Convert or rename to `profile.jpg`.
- To move the crop up or down, open `styles.css`, find `.portrait-photo`, and
  change `background-position: center 30%;` (a smaller percentage shows more of
  the top of the photo).

---

## 4. Add your CV

1. Export your CV as a PDF. Anyone can download it, so for this public copy
   consider replacing your referees' email addresses with "References available
   on request".
2. Name it exactly **`Pervez_Ali_CV.pdf`** and put it in `assets/cv/` on your
   computer (to preview it).
3. Upload it to the `assets/cv` folder of your GitHub repository (section 8).

The **Download CV (PDF)** button then appears on its own, and the sentence
"A current CV is available on request" disappears. Until the file is there,
visitors see that sentence instead of a broken link.

To update the CV later, replace the PDF with the new version (same file name)
and upload the site again.

If you want a different file name, change it in the CV section of `index.html`
in both `href="assets/cv/…"` and `download="…"`.

---

## 5. Add a new publication

The publication list is in the PUBLICATIONS section of `index.html`, newest
first. Each entry is one `<li class="pub" …> … </li>` block.

1. Find the block that starts with `===== TEMPLATE: copy from here` near the
   end of the list.
2. Copy everything between `copy from here ...` and `... to here`, **without**
   those two comment lines.
3. Paste it at the correct place in the list (usually the top, since the list
   runs newest first).
4. Fill it in:

```html
<li class="pub" id="ali2027example">                 <!-- a unique short name -->
  <div class="pub-side">
    <span class="pub-year">2027</span>
    <span class="pub-status">Accepted</span>         <!-- Published, Accepted, Preprint or Submitted -->
  </div>
  <div class="pub-main">
    <h4 class="pub-title">Title of the Paper</h4>
    <p class="pub-authors"><span class="pub-me">Pervez Ali</span>, Coauthor One and Coauthor Two</p>
    <p class="pub-venue">To appear in Journal Name</p>
    <p class="pub-summary">One or two sentences on what the paper does.</p>   <!-- optional -->
    <div class="pub-actions">
      <ul class="link-list">
        <li><a href="https://arxiv.org/pdf/2701.12345">PDF</a></li>
        <li><a href="https://arxiv.org/abs/2701.12345">arXiv</a></li>
        <li><a href="">DOI</a></li>                   <!-- empty: hidden automatically -->
        <li><a href="">Code</a></li>
      </ul>
      <details class="bibtex">
        <summary>BibTeX</summary>
        <div class="bibtex-panel">
<pre><code id="bib-ali2027example">@article{ali2027example,
  ...paste the BibTeX entry here...
}</code></pre>
          <button class="copy-button" type="button" data-copy="bib-ali2027example" data-copy-name="BibTeX" hidden>Copy BibTeX</button>
        </div>
      </details>
    </div>
  </div>
</li>
```

Notes:

- **Status label:** write the status inside `<span class="pub-status">…</span>`.
  Use Published, Accepted, Preprint or Submitted. Manuscripts that are not yet
  public go in the separate "Work in progress" list below it, with the label
  "In preparation".
- **Your name:** wrap it in `<span class="pub-me">…</span>` so it appears in bold.
- **Summary:** the `<p class="pub-summary">…</p>` line holds a plain-language
  sentence or two about the paper. It is optional; delete the line if you don't
  want one.
- **Links:** fill in the ones you have. Any link left as `href=""` is hidden
  automatically, so you never show a button that goes nowhere. You can also
  delete the whole `<li>…</li>` line for a link you will never need.
- **BibTeX:** on an arXiv page, use "Export BibTeX Citation"; on Google Scholar,
  use "Cite", then "BibTeX". Paste it between `<code …>` and `</code>`.
  Start the `<pre><code …>` line at the very beginning of the line (as in the
  existing entries) so the copied text has no extra spaces.
- **The id rule:** the `id="bib-…"` on `<code>` must be unique on the page, and
  the Copy button's `data-copy="bib-…"` must match it exactly. Otherwise the
  button will not appear.
- **When a preprint is published:** change the status to Published, replace the
  venue line with the journal (e.g. `Journal Name 12(3), 45–67`), add the DOI
  link (`https://doi.org/…`), and update the BibTeX.

---

## 6. Other common edits

**Selected projects.** The site used to have a "Selected projects" list under
Research. It was removed because it repeated the papers already listed under
Publications. Each publication now has a short summary instead. If you later
want a projects section again (for example for software or work in progress),
ask Claude to add one, or restore it from the repository's history (the
"Add academic website" commit).

**Change a research theme's status.** Each theme starts with a status line
("Current research" or "Future direction"). A future theme also has the class
`theme theme--future`, which draws it with an open circle and a dashed line.

**Add a course.** In TEACHING, copy one table row:

```html
<tr><th scope="row">Course name</th><td data-label="Role">Instructor</td><td data-label="Terms">Fall 2025</td></tr>
```

Keep the `data-label="…"` parts; on phones they label each line.

**Add or remove a profile link.** In CONTACT, profile links are a list of
`<li><a href="…">Name</a></li>`. Add a line for a new profile, or leave the
address empty (`href=""`) to hide one. An "arXiv author page" line is already
there, empty.

**Change colours or fonts.** Open `styles.css`; everything is defined once in
the `:root { … }` block near the top, with a comment on each colour.

**The interactive demo.** Under the research themes, two panels compare
standard and nonreversible Langevin dynamics on a stretched two-dimensional
Gaussian, with a chart of the exact Kullback–Leibler divergence to the target.
The animation is drawn by `demo.js`; it starts when the demo scrolls into view
(not for visitors who have asked their device to reduce motion), pauses when it
scrolls away, and stops after one run. Its settings (target shape, step size,
number of points, starting point, run length) are listed at the top of
`demo.js`. If you change them, also update the caption under the demo in
`index.html`, which states the default values. Visitors without JavaScript see
a snapshot, `assets/images/langevin-demo.png`, instead. To remove the demo,
delete the block between `INTERACTIVE DEMO` and `END OF DEMO` in `index.html`
and the `demo.js` line near the top of that file.

---

## 7. Publish on GitHub Pages

GitHub Pages hosts the site for free at **https://pervezali1.github.io**. The
site stays online as long as the repository exists. This address is already
filled in at the top of `index.html`.

1. **Unzip** the download so you have the `pervez-ali-website` folder
   (on a Mac, double-click the ZIP; on Windows, right-click it → Extract All).
2. **Sign in** at <https://github.com> as `pervezali1`.
3. **Create the repository.** Click **+** (top right) → **New repository**.
   - Repository name: **`pervezali1.github.io`**, exactly your username
     followed by `.github.io`.
   - Choose **Public**. Free GitHub Pages sites must be public.
   - Leave "Add a README file" off, then click **Create repository**.
4. **Upload the files.** On the new, empty repository page, click the link
   **uploading an existing file**. Open the unzipped `pervez-ali-website`
   folder on your computer, select everything *inside* it (Ctrl+A on Windows,
   Cmd+A on Mac): `index.html`, `styles.css`, `script.js`, `README.md` and
   the `assets` folder. Drag the selection onto the browser window.
   - Drag the files inside the folder, not the folder itself. Otherwise the
     site ends up one level down and the main address shows "404".
   - Use drag and drop: the "choose your files" button cannot select folders.
   - Wait until the list shows all 21 files, including those inside `assets`.
5. **Commit.** At the bottom of the page, type a short message such as
   `Add website`, keep **Commit directly to the main branch**, and click
   **Commit changes**. The repository's file list should now show `index.html`
   and the `assets` folder at the top level.
6. **Turn on GitHub Pages.** Click **Settings** (top of the repository), then
   **Pages** in the left sidebar (under "Code and automation"). Under
   **Build and deployment**, set **Source** to **Deploy from a branch**, choose
   branch **main** and folder **/ (root)**, and click **Save**.
7. **Wait a few minutes** (up to 10). The Pages settings page then says your
   site is live at https://pervezali1.github.io. The repository's **Actions**
   tab shows the progress; a green tick means it is published.
8. **Check it.** Open the address in a private/incognito window and on your
   phone. Paste it into LinkedIn's
   [Post Inspector](https://www.linkedin.com/post-inspector/) to see the link
   preview.

If you ever publish at a different address (another repository name, another
host, or your own domain), change the three lines marked `<!-- address -->`
near the top of `index.html`.

You can later connect your own domain (for example `pervezali.com`) under
**Settings → Pages → Custom domain**. Add the site address to your CV, Google
Scholar profile, ORCID record, LinkedIn and email signature.

### Alternative: Netlify Drop

If you prefer another host: sign in at <https://app.netlify.com>, open
<https://app.netlify.com/drop>, and drag the whole `pervez-ali-website` folder
onto the drop area. New Netlify projects can start private, so choose
**Make public** after the first deploy. Rename the project under
**Customize → Manage project name and cover image**. Then update the three
`<!-- address -->` lines in `index.html` and drop the folder again. Later
updates go to the drag-and-drop area under **Production deploys**, always as
the whole folder.

---

## 8. Upload an updated version later

Edit the files on your computer and check them with a preview (section 1).
Then:

1. Open your repository: <https://github.com/pervezali1/pervezali1.github.io>.
2. Go into the folder where the file belongs. For `index.html` or
   `styles.css`, stay on the main page. For your CV, click `assets`, then
   `cv`. For your photo, click `assets`, then `images`.
3. Click **Add file → Upload files**, drag in the changed or new files, and
   click **Commit changes**. A file with the same name replaces the old one.
4. The live site updates within a few minutes. If you still see the old
   version, hard-refresh (Ctrl+Shift+R or Cmd+Shift+R).

**Small text edits directly on GitHub.** Open `index.html` in the repository,
click the pencil icon (**Edit this file**), make the change and click
**Commit changes**. Make the same change on your computer, or download the
latest version (green **Code** button → **Download ZIP**), so a later upload
does not undo it.

**Delete a file.** Open it on GitHub, click the **⋯** menu at the top right,
choose **Delete file**, then commit.

GitHub keeps every earlier version of every file (click a file, then
**History**), so nothing is lost if an edit goes wrong.

---

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| The page layout suddenly looks broken | A tag was probably damaged (a missing `<`, `>` or closing tag). Undo the last change, or compare with the original download. |
| My change doesn't show online | Wait a few minutes. The repository's **Actions** tab shows a green tick when the new version is live. Then hard-refresh the browser. |
| The main address shows "404" | Check that the repository is named `pervezali1.github.io` and is public, that `index.html` is at the top level (not inside a `pervez-ali-website` folder), and that **Settings → Pages** uses branch `main` and folder `/ (root)`. |
| The photo doesn't appear | The file must be `assets/images/profile.jpg`, lowercase, in JPG format. |
| The CV button doesn't appear online | The file must be named `Pervez_Ali_CV.pdf` (exact spelling) and uploaded into the `assets/cv` folder of the repository. |
| A Copy button is missing | Its `data-copy="…"` must match the `id="…"` of the text it copies. |
| The browser's developer console shows "404 … profile.jpg" or "… Pervez_Ali_CV.pdf" | Harmless. The site checks for these files; the message stops once they exist. |

**Without JavaScript** (a few visitors turn it off) all content still shows.
The phone menu stays open, BibTeX can be selected and copied by hand, and the
CV section shows the "available on request" sentence.

---

## 10. Checklist before publishing

- [ ] Photo saved as `assets/images/profile.jpg` (optional; the initials look fine without it)
- [ ] CV saved as `assets/cv/Pervez_Ali_CV.pdf`
- [ ] Optional links: code repositories, arXiv author page
- [ ] Double-check dates and details against your CV (for example, your expected PhD date)
- [ ] Site address: set to `https://pervezali1.github.io`. If you publish anywhere else, change the three `<!-- address -->` lines at the top of `index.html`

---

### Credits

- Fonts: [Newsreader](https://github.com/productiontype/Newsreader) by
  Production Type and [IBM Plex Sans](https://github.com/IBM/plex) by IBM, both
  under the SIL Open Font License (see `assets/fonts/`).
- The orbit drawing around the portrait is decorative artwork generated from a
  simulated stochastic process. It is not research data.
- The equation image was typeset with MathJax.
