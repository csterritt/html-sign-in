'use strict';

var cookie = require('cookie');

const footer = () => `
  <div class="mx-6" data-testid="footer-banner">
    <span>Content copyright Chris Sterritt, 2024</span>
    <span class="mx-2">-</span>
    <span>V-10</span>
  </div>
`;

const SERVER_URL = 'https://html-sign-in.pages.dev'; 

 const ASSET_SERVER_URL = ''; 

const STANDARD_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
};

const layout = (content) => `
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

const header = (testId, buttonContent = '') => `
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
  const content = `
    ${header('testpage-banner')}

    <div class="mx-6">
      <h3>Waiting for the code sent to email ${emailSent}</h3>
    </div>
  `;

  return new Response(layout(content), { headers: STANDARD_HEADERS })
};
