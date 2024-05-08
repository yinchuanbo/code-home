const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const marked = require("marked");
var sass = require("node-sass");
const folderPath = "./md";

const mdFilePaths = [];
let filesList = [];

function traverseFolder(folderPath) {
  const files = fs.readdirSync(folderPath);
  files.forEach((file) => {
    const newName = file.replace(/\.md$/, "");
    filesList.push(newName);
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile() && path.extname(filePath) === ".md") {
      mdFilePaths.push(filePath);
    } else if (stats.isDirectory()) {
      traverseFolder(filePath);
    }
  });
}

traverseFolder(folderPath);
const docPath = "./docs";

try {
  const docsFiles = fs.readdirSync(docPath);
  for (let i = 0; i < docsFiles.length; i++) {
    const docsFile = docsFiles[i];
    const filePath = path.join(docPath, docsFile);
    const stats = fs.statSync(filePath);
    if (stats.isFile() && path.extname(docsFile) === ".html") {
      fs.unlinkSync(filePath);
    }
  }
} catch (err) {
  console.error("Error deleting files:", err);
}

let listHTML = `<ul class="home__list">`;

filesList = filesList.sort((a, b) => Number(a) - Number(b));

for (let i = filesList.length - 1; i >= 0; i--) {
  const file = filesList[i];
  const markdownContent = fs.readFileSync(`./md/${file}.md`, "utf-8");
  marked.setOptions({
    highlight: function (code, lang) {
      return code;
    },
  });
  const tokens = marked.lexer(markdownContent);
  let h2Content = "";
  let jsContent = "";
  let cssContent = "";
  let htmlContent = "";
  tokens.forEach((token) => {
    if (token.type === "code") {
      if (token.lang === "js") {
        jsContent += token.text + "\n";
      } else if (token.lang === "css") {
        cssContent += token.text + "\n";
      } else if (token.lang === "html") {
        htmlContent += token.text + "\n";
      }
    } else if (token.type === "heading") {
      h2Content += token.text;
    }
  });

  let title, type, iframe;

  const titleMatch = h2Content.match(/title:\s*"([^"]+)"/);
  const dateMatch = h2Content.match(/date:\s*([^\s]+)/);
  const typeMatch = h2Content.match(/type:\s*([^\s]+)/);
  const iframeMatch = h2Content.match(/iframe:\s*([^\s]+)/);
  title = titleMatch ? titleMatch[1] : null;
  date = dateMatch ? dateMatch[1] : null;
  type = typeMatch ? typeMatch[1] : null;
  iframe = iframeMatch ? iframeMatch[1] : null;
  const templateContent = fs.readFileSync("./templates/editor.html", "utf-8");

  let sassCss = cssContent;

  try {
    const sassRes = sass.renderSync({
      data: cssContent,
    });
    sassCss = sassRes.css.toString();
  } catch (error) {}

  const compiledIframeHtml = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>IFRAME</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
      />
      <script src="https://unpkg.com/pagedjs/dist/paged.legacy.polyfill.js"></script>
      <style>
        * {
          padding: 0;
          margin: 0;
          font-family: Montserrat;
        }
        html,
        body {
          height: 100%;
        }
        body {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-thumb {
          border-radius: 0;
          background: rgba(255, 255, 255, 0.4);
        }
        ::-webkit-scrollbar-track {
          box-shadow: none;
          border-radius: 0;
          background: transparent;
        }
      </style>
      <style id="live-preview-style">${sassCss || cssContent}</style>
    </head>
    <body>
      ${htmlContent}
      <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.js"></script>
      <script src="https://hammerjs.github.io/dist/hammer.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.0/anime.min.js"></script>
      <script id="script__preview">${jsContent}</script>
    </body>
  </html>
  `;

  const compiledIframeHtml2 = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>IFRAME</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
      />
      <script src="https://unpkg.com/pagedjs/dist/paged.legacy.polyfill.js"></script>
      <style>
        * {
          padding: 0;
          margin: 0;
          font-family: Montserrat;
        }
        html,
        body {
          height: 100%;
        }
        body {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-thumb {
          border-radius: 0;
          background: rgba(255, 255, 255, 0.4);
        }
        ::-webkit-scrollbar-track {
          box-shadow: none;
          border-radius: 0;
          background: transparent;
        }
        #carousel-wrapper, .waving, .folder, .glass-container, .g-flex, .theme-app, .faqs__translator {
          transform: scale(${iframe})
        }
      </style>
      <style id="live-preview-style">${sassCss || cssContent}</style>
    </head>
    <body>
      ${htmlContent}
      <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.js"></script>
      <script src="https://hammerjs.github.io/dist/hammer.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.0/anime.min.js"></script>
      <script id="script__preview">${jsContent}</script>
    </body>
  </html>
  `;

  let params = `doc-${file}`;
  fs.writeFileSync(`./docs/iframes/${params}-iframe.html`, compiledIframeHtml);
  fs.writeFileSync(
    `./docs/iframes/${params}-iframe2.html`,
    compiledIframeHtml2
  );

  const compiledHtml = ejs.render(templateContent, {
    title: (title || "").trim(),
    type: (type || "").trim(),
    cssContent: (cssContent || "").trim(),
    jsContent: (jsContent || "").trim(),
    htmlContent: (htmlContent || "").trim(),
    url: iframe
      ? `iframes/${params}-iframe.html`
      : `iframes/${params}-iframe.html`,
  });

  fs.writeFileSync(`./docs/${params}.html`, compiledHtml);

  listHTML += `
      <li>
        <div class="li__mask">
          <div class="get-code" onclick="location.href='/${params}.html'">
          <svg t="1714836202680" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13567" width="20" height="20"><path d="M438.4 849.1l222.7-646.7c0.2-0.5 0.3-1.1 0.4-1.6L438.4 849.1z" opacity=".224" p-id="13568" fill="#ff0000"></path><path d="M661.2 168.7h-67.5c-3.4 0-6.5 2.2-7.6 5.4L354.7 846c-0.3 0.8-0.4 1.7-0.4 2.6 0 4.4 3.6 8 8 8h67.8c3.4 0 6.5-2.2 7.6-5.4l0.7-2.1 223.1-648.3 7.4-21.4c0.3-0.8 0.4-1.7 0.4-2.6-0.1-4.5-3.6-8.1-8.1-8.1zM954.6 502.1c-0.8-1-1.7-1.9-2.7-2.7l-219-171.3c-3.5-2.7-8.5-2.1-11.2 1.4-1.1 1.4-1.7 3.1-1.7 4.9v81.3c0 2.5 1.1 4.8 3.1 6.3l115 90-115 90c-1.9 1.5-3.1 3.8-3.1 6.3v81.3c0 4.4 3.6 8 8 8 1.8 0 3.5-0.6 4.9-1.7l219-171.3c6.9-5.4 8.2-15.5 2.7-22.5zM291.1 328.1l-219 171.3c-1 0.8-1.9 1.7-2.7 2.7-5.4 7-4.2 17 2.7 22.5l219 171.3c1.4 1.1 3.1 1.7 4.9 1.7 4.4 0 8-3.6 8-8v-81.3c0-2.5-1.1-4.8-3.1-6.3l-115-90 115-90c1.9-1.5 3.1-3.8 3.1-6.3v-81.3c0-1.8-0.6-3.5-1.7-4.9-2.7-3.5-7.7-4.1-11.2-1.4z" p-id="13569" fill="#ff0000"></path></svg>Get Code</div>
          <iframe
            id="live-preview"
            src="./iframes/${params}-iframe2.html"
            width="100%"
            height="100%"
            allow="accelerometer *; camera *; encrypted-media *; display-capture *; geolocation *; gyroscope *; microphone *; midi *; clipboard-read *; clipboard-write *; web-share *; serial *; xr-spatial-tracking *"
            allowfullscreen="true"
            allowpaymentrequest="true"
            allowtransparency="true"
            sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-downloads allow-presentation"
            class="result-iframe iframe-visual-update"
            name="codeShow"
            loading="lazy"
          ></iframe>
        </div>
        <h2>${title}</h2>
      </li>`;
}

function unescapeHtml(html) {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

listHTML += `</ul>`;

const homeContent = fs.readFileSync("./templates/home.html", "utf-8");

const homeHTML = ejs.render(homeContent, {
  content: unescapeHtml(listHTML),
  len: filesList?.length ?? 0,
});

fs.writeFileSync(`./docs/index.html`, homeHTML);
