/* tslint:disable */
// @ts-nocheck
require('dotenv').config();

export const environment = {
    endpoint: `"${process.env.endpoint}"`,
    production: true,
    secret_key: `"${process.env.secret_key }"`,
    siteKey: `"${process.env.siteKey }"`
  };

  
/* tslint:enable */