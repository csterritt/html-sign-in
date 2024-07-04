'use strict';

var html = require('@worker-tools/html');
var cookie = require('cookie');

const footer = () => html.html`
  <div class="mx-6" data-testid="footer-banner">
    <span>Content copyright Chris Sterritt, 2024</span>
    <span class="mx-2">-</span>
    <span>V-6</span>
  </div>
`;

// export const FUNCTION_SERVER_URL = 'https://html-sign-in.pages.dev' // PRODUCTION:UNCOMMENT

const SERVER_URL = 'http://localhost:3000'; // PRODUCTION:REMOVE
// export const SERVER_URL = 'https://html-sign-in.pages.dev' // PRODUCTION:UNCOMMENT

const ASSET_SERVER_URL = 'http://localhost:3000'; // PRODUCTION:REMOVE
// export const ASSET_SERVER_URL = '' // PRODUCTION:UNCOMMENT

const layout = (content) => html.html`
  <html lang="en">
    <head>
      <link href="${ASSET_SERVER_URL}/style.css" rel="stylesheet" />
      <title>HTML Sign In</title>
    </head>

    <body
      class="font-slabserif h-full min-h-screen flex flex-col justify-between md:mx-auto max-w-7xl pb-3 bg-gray-200 dark:bg-gray-900"
    >
      ${content}
      <!-- -->
      ${footer()}
    </body>
  </html>
`;

const header = (testId, buttonContent = '') => html.html`
  <div
    class="flex flex-row items-center justify-between min-h-16 mb-2 rounded-b-lg md:mx-4 shadow-lg bg-primary text-primary-content dark:bg-accent dark:text-accent-content"
    data-testid="${testId}"
  >
    <div class="px-2 mx-2">
      <a href="${SERVER_URL}/">
        <span class="text-lg font-bold md:hidden">SI-EX</span>
        <span class="text-lg font-bold hidden md:inline-block">
          Sign In Example
        </span>
      </a>
    </div>

    ${buttonContent}
  </div>
`;

export const onRequest = async (context) => {  const cookies = cookie.parse(context.request?.headers?.get('cookie')) || {};
  const emailSent = cookies['email'] || 'no email';
  const content = html.html`
    ${header('testpage-banner')}

    <div class="mx-6">
      <h3>Waiting for the code sent to email ${emailSent}</h3>
    </div>
  `;

  return new html.HTMLResponse(layout(content))
};

