/**
 * DaVinci Education - Unified Param Handler Config
 * Salesforce Web-to-Lead form field mapping
 *
 * Hidden fields: RA_fbp__c, RA_fbc__c, RA_gclid__c, RA_wbraid__c, RA_gbraid__c,
 *                RA_User_Agent__c, RA_Client_IP__c, utm_source__c, utm_medium__c, utm_campaign__c
 */

import { SourceType } from './src/constants.js';

export default [
  // --- Facebook Handlers ---
  {
    id: 'fbc',
    sourceType: SourceType.URL_OR_COOKIE,
    urlParamName: 'fbclid',
    cookieName: '_fbc',
    targetInputName: 'RA_fbc__c',
    applyFormatting: 'formatFbClickId',
    setCookie: {
      enabledOnUrlHit: true,
      cookieNameToSet: '_fbc',
      daysToExpiry: 90,
    },
    retryMechanism: {
      enabled: true,
      maxAttempts: 5,
      interval: 5000,
    },
  },
  {
    id: 'fbp',
    sourceType: SourceType.COOKIE,
    cookieName: '_fbp',
    targetInputName: 'RA_fbp__c',
    retryMechanism: {
      enabled: true,
      maxAttempts: 5,
      interval: 5000,
    },
  },

  // --- Google Handlers ---
  {
    id: 'gclid',
    sourceType: SourceType.URL,
    urlParamName: 'gclid',
    targetInputName: 'RA_gclid__c',
    persist: true,
  },
  {
    id: 'wbraid',
    sourceType: SourceType.URL,
    urlParamName: 'wbraid',
    targetInputName: 'RA_wbraid__c',
    persist: true,
  },
  {
    id: 'gbraid',
    sourceType: SourceType.URL,
    urlParamName: 'gbraid',
    targetInputName: 'RA_gbraid__c',
    persist: true,
  },

  // --- UTM Handlers ---
  {
    id: 'utm_source',
    sourceType: SourceType.URL,
    urlParamName: 'utm_source',
    targetInputName: 'utm_source__c',
    persist: true,
  },
  {
    id: 'utm_medium',
    sourceType: SourceType.URL,
    urlParamName: 'utm_medium',
    targetInputName: 'utm_medium__c',
    persist: true,
  },
  {
    id: 'utm_campaign',
    sourceType: SourceType.URL,
    urlParamName: 'utm_campaign',
    targetInputName: 'utm_campaign__c',
    persist: true,
  },

  // --- Browser/Client Info ---
  {
    id: 'userAgent',
    sourceType: SourceType.USER_AGENT,
    targetInputName: 'RA_User_Agent__c',
  },
  {
    id: 'clientIp',
    sourceType: SourceType.IP_ADDRESS,
    targetInputName: 'RA_Client_IP__c',
  },
];
