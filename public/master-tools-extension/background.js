// // Master Tools BD Extension - Background Script
// // This script handles the main functionality of the extension

// // Listen for messages from the content script
// // import { CookieEditor } from 'https://unpkg.com/cookie-editor/dist/cookie-editor.min.js';
// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   if (message.type === "SET_COOKIES") {
//     const { domain, cookieData } = message.payload;
    
//     try {
//       console.log("Setting cookies for domain:", domain);
      
//       // Parse the cookie data
//       const cookies = JSON.parse(cookieData);
      
//       // Set each cookie
//       const cookiePromises= cookies.map(cookie => {
//         // return new Promise((resolve, reject) => {
//         //     chrome.cookies.set(cookie, function(response) {
//         //         if (chrome.runtime.lastError) {
//         //             reject(new Error(chrome.runtime.lastError));
//         //         } else {
//         //             resolve(response);
//         //         }
//         //     });
//         // });
//         return chrome.cookies.set({
//           url: `https://${cookie.domain}`,
//           name: cookie.name,
//           value: cookie.value,
//           domain: cookie.domain , // Ensure domain is properly set
//           path: cookie.path || '/', // Default to root path
//           // secure: cookie.secure !== undefined ? cookie.secure : true, // Defaults to true for secure cookies
//           // httpOnly: cookie.httpOnly !== undefined ? cookie.httpOnly : false, // Defaults to false for general cookies
//           // sameSite: cookie.sameSite || "no_restriction", // Default to "no_restriction" for compatibility
//           expirationDate: cookie.expirationDate || (Date.now() / 1000) + 86400 * 30, // Default to 30 days expiration if not provided
          
//         });
//       });
      
//       Promise.all(cookiePromises)
//         .then(() => {
//           console.log("All cookies set successfully, opening domain:", domain);
//           // After setting all cookies, open the domain in a new tab
//           chrome.tabs.create({ url: `https://${domain}` });
          
//           // Increment the cookie count
//           chrome.storage.local.get(['cookieCount'], function(result) {
//             const count = (result.cookieCount || 0) + 1;
//             chrome.storage.local.set({ cookieCount: count });
//             console.log("Cookie count incremented to:", count);
//           });
          
//           sendResponse({ success: true });
//         })
//         .catch(error => {
//           console.error('Error setting cookies:', error);
//           sendResponse({ success: false, error: error.message });
//         });
//     } catch (error) {
//       console.error('Error processing cookies:', error);
//       sendResponse({ success: false, error: error.message });
//     }
    
//     return true; // Keep the message channel open for the async response
//   }
  
//   // Handle the new platform access API
//   if (message.type === "ACCESS") {
//     const { platform, token, platformData } = message.payload;
    
//     try {
//       console.log("Accessing platform:", platform);
      
//       // If platformData is already provided, use it directly
//       if (platformData) {
//         processPlatformData(platformData, sendResponse);
//       } 
//       // Otherwise fetch it from the API
//       else {
//         fetchPlatformData(platform, token)
//           .then(data => processPlatformData(data, sendResponse))
//           .catch(error => {
//             console.error('Error fetching platform data:', error);
//             sendResponse({ success: false, error: error.message });
//           });
//       }
//     } catch (error) {
//       console.error('Error processing platform access:', error);
//       sendResponse({ success: false, error: error.message });
//     }
    
//     return true; // Keep the message channel open for the async response
//   }
// });

// // Function to fetch platform data from the API
// async function fetchPlatformData(platform, token) {
//   const apiUrl = `https://tbd.secureguardwave.com/api/cookies/latest?platform=${platform}`;
  
//   const response = await fetch(apiUrl, {
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   });
  
//   if (!response.ok) {
//     if (response.status === 401) {
//       throw new Error('Authentication expired. Please log in again.');
//     }
//     throw new Error(`API error: ${response.status}`);
//   }
  
//   return await response.json();
// }

// // Function to process platform data and set cookies
// async function processPlatformData(data, sendResponse) {
//   try {
//     const { domain, redirect, cookies } = data;
//     console.log(redirect,domain)
//     // Set each cookie
//     for (const cookie of cookies) {
//       // await chrome.cookies.set({
//         await chrome.cookies.set({
//           url: `https://${cookie.domain}`,
//           name: cookie.name,
//           value: cookie.value,
//           domain: cookie.domain , // Ensure domain is properly set
//           path: cookie.path || '/', // Default to root path
//           // secure: cookie.secure !== undefined ? cookie.secure : true, // Defaults to true for secure cookies
//           // httpOnly:  false, // Defaults to false for general cookies
//           // sameSite: cookie.sameSite || "no_restriction", // Default to "no_restriction" for compatibility
//           // expirationDate: cookie.expires || (Date.now() / 1000) + 86400 * 30, // Default to 30 days expiration if not provided
//           // session: cookie.session || false, // Defaults to false, making the cookie persistent unless specified
//         });
//       //   url: `https://${cookie.domain || domain}${cookie.path || "/"}`,
//       //   name: cookie.name,
//       //   value: cookie.value,
//       //   domain: cookie.domain || `.${domain}`,
//       //   path: cookie.path || '/',
//       //   secure: true,
//       //   httpOnly: false,
//       //   sameSite: "no_restriction",
//       //   expirationDate: cookie.expires || (Date.now() / 1000) + 86400 * 30 // 30 days default
//       // });
//     }
    
//     // Open in a new tab
//     chrome.tabs.create({ url: redirect || `https://${domain}` });
    
//     // Increment the access count
//     chrome.storage.local.get(['accessCount'], function(result) {
//       const count = (result.accessCount || 0) + 1;
//       chrome.storage.local.set({ accessCount: count });
//       console.log("Access count incremented to:", count);
//     });
    
//     sendResponse({ success: true });
    
//   } catch (error) {
//     console.error('Error processing platform data:', error);
//     sendResponse({ success: false, error: error.message });
//   }
// }

// // Extension installation handler
// chrome.runtime.onInstalled.addListener(function(details) {
//   if (details.reason === "install") {
//     console.log("Extension installed! Opening welcome page");
//     // Open a welcome page when the extension is first installed
//     chrome.tabs.create({
//       url: "welcome.html"
//     });
//   } else if (details.reason === "update") {
//     console.log("Extension updated");
//   }
// });

// // Add browser action click handler
// chrome.action.onClicked.addListener(function(tab) {
//   console.log("Extension icon clicked");
//   // Notify the page that the extension is active
//   chrome.tabs.sendMessage(tab.id, { type: "EXTENSION_ACTIVATED" });
// });

// console.log("Background script loaded");

// // [
// //   {
// //       "domain": ".chatgpt.com",
// //       "expirationDate": 1748380400.568942,
// //       "hostOnly": false,
// //       "httpOnly": false,
// //       "name": "_puid",
// //       "path": "/",
// //       "sameSite": "lax",
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "user-uZevpjp4Wgae9BhuieXEAN6X:1747775600-UcDTr2OgQnoUOYOEP20MwGW4egJJhdpnMuDtn2Gj6UA%3D"
// //   },
// //   {
// //       "domain": ".chatgpt.com",
// //       "expirationDate": 1755562932.838204,
// //       "hostOnly": false,
// //       "httpOnly": true,
// //       "name": "__Secure-next-auth.session-token",
// //       "path": "/",
// //       "sameSite": "lax",
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..cXMGOFwj_zghU8YT.kKvY5iAvKkBy-00ih70f1iyxMBRR27d58A9917_SqtagJG7oa8-B20_wACJsQBnjMwMo2frh4ZDN40p6faanuTOFO_trc_Ymes4mdeedwhwOGoP-pljgK9RhYS3o-3hLyJIgSo0o_l8NK1uYXD44DebT3w9pt465xDZxqRM2egGmeGeVvk0ulnPszMp6Q4vU0ANdkqEDM9rRv4IUk-zOHbqVENIMlKfdbG-s7HbZC2am0oK0K52tMLGP6GMdlyzJVdnJWnsLipu4Ydk94GmB73qpcosFye5zfoUkjdcAhaDdTpjlHjTRERHK7B0avaxgWxq2htI-qRUYD8vP3-ft2GGUEe586IP_t-qbQUy-qsjWx5IBW72YlvQ5yazjTHbZwt-WkteDAvISFSW_4bGhYPk_fz2463LHHypE-rroufPWsJrR6JZzioWSdYx47NZ5fW7rQasc0kUs4PKf78KNbDhonLjsYBdqm6gA3wlPTC_y9TJWh2xYYuNRRJqVSuigZj_tnH9ous-IPUTw0_gNryLHYdREsv6p-7KJfHtJvwo3k_v79mpsTUBzZ_YVsyV7RkjvJRbgSbR3Wf7fJRIYu3sR5Zmd0X9uLXETCxGh1lYDvCR99QtV18Agxc6OJWd_8_cWubHyppJfqpeMFSB3MkrQI_nXf_AHq1wq_ajtvStMJPRhBWNoVymmQ5OzCfG8_XCgGuH_lgViDVod_rBGNpm_UI6sfSyaIzUZM8XX3WKh7cGROVTRmfmALP3XJ89tzSCbJ3rUz0AdpEC1Gi6230osSOV3gY43G_95CfCp00LsNZfXeGsUtipl-WKoT7N3LVwq1tPBAU5gCmg3XUz59mVf-SF4pvTYZv4UKDymjozy9s1uH323ondhTtJSrsGrLpgkLy3ZPiG8ApyC9Rcwhw7h75F0ppfS0atuT13-8I18s725sWJOhPdLwHRQvAkE6aazPcW_oz9sQCvg3FOsHP8cqosCZ2HGdKch3mPz2WYn44uNIDOrn68eACZIthY4rNXrILvpqbMVaLJ204rL5QwyEwbGBjhf2C6lPZQcf7K5d9BYpnfH8dxQEjKFx9rJKBN9khasNM7Y7e2cbAj9tvn3lTDsfqzBy_t9TrpXd4xnaQj4h58q5UwTjj46N-DkPsq1aGrmhnFnk4PnPRxP8k0TAoxeRo902KYwzjVdjibXQnaU2lLZCDAGZkRZS1bqO6-9TLUuuFNgQ7id198l4ey9QTNeHsSzxAoRUGeeRpAjPRCDm8p8lKY9iffDudUae5QBjTfmIS8b66IeKnVRADzc86HObywkl2YzeiG_2jh-do0Wa4dss1rRy6XeIwJtUqHImQSKRqR305B3fffS17qLe9X4Jlvf7-b9eG3YZWTTCpnZ0cNqwvFLwu7dXvbdAW3BWYukfrzdo-yV9fVaa3s6K04Wujg6twhWPu4aC6InwY10-OPMr1kJwclXw0U6ihrVSe-FCzFsfpZwuYjyM9meo-l3yyXm1vlY84AZbUtx9v82PrKk0MTm8f-EXke5DJy1rFlArZEhAEJiYZkcOOKzIRWWXYS8yDQ0glffndUT6bxGlS1r4F6HhEAanxY6Rfn7fasaI3-78SPVlZjf9FXUiBA4StY5pnvgDJZruuHyQ2YsjjAAr9rVM_0y2eV-N1rLBmcAHKhhnS_a8xsO89nZalQdDp70BKGePmekR16qQdri6s5p8-v_-qQKQMPZmktjs92OcCAA2tqTsfGVY2DRWZL2SwvUvrIZI2ajRErR3bnFTtgNGMlthLZ9oDJ3bTu-3_h3MBDCODIMhnscUkC33XU1zo_deMZuCI6Jadxbr2TIWKfEV8b18xk6cusr7byW9G6v8hpAqDLpIihtM2naNJuQu7OXXC4N5i0Zd59NiOvIXs21mgmfhlNaYiOSI5MEaelel_ld8jH73IlYLM4Mf29TJ0tHE4QBza4M4YQQJmHZp9ER1YOjE3kRYEenWKfNgKYVTTGZGtH8DtmGPYCWXexGc87z23X6G3ofeyJrkOkRCsH6fhrZYHEAEI8QC0yC2ajlFNQjH6RTLK5sUEH4vYyo1ZAMnD3_9iyLBZuXe-5oQSzy77vXBYLm2djA4V4Ji36Um4bnDvM4GB-GMK8V-7xR6Re87mCF8ITYbotBFM3cm0MDy8kR2212ErFhIwJLa7G3afp_42Z5UpxcZQrN9jkZ5jQaVmh7v3ozQdOiPKPX1c6MKBVjWxq4LbMkRyHIulLEWSOOjvuJ0OGMkeIK3lflho7PXO_AD9rsGllNAdU9IJ7hdX96DtpLdTbvJ8T9murpKBET0iq5TjQ13lD4AvOHPeM2GUZ6j0GexNiNf2sxyofcrYzvOWMsvzasrnXW7jL2tBWtJridpJd00HAercmBLz0BmR5WiioqRdu0K2QJuO-ayg5VpJt6qSgLa-8CYqidODRDgwGXEu1hvbowFjVpJlt53HYn5EAKq2oi8Bdst6aMiZpb4xpWEOMoxkGEI-lHGs-UjbhLqS7rq6Cl2CQK0dhHVJTQeyNRJ7kTMF_PFvTmZTDsgKVHL3z_f3sRAEc4EKEXMi-us_HtUXJdNvEBDYXxML4Pd2Z7gFSECBeaUpAxfOGssXE_celETifVUfhEOahoVAeOvbEz3rE0E1-jNxpiKuM3oq1K-FcXDryQbxtiBLGeu0AHww2Fx3uJCR9zLQZDo_DN7ly8BVy4vxi3Kfzn7CdtfoWCRv8tDL5DyhJF4MyUiimicCKiPlAe9rwEGR4kYs3efyD2lW3xiTPMb1sPwcinmtLwDHeRn2JB5eIxk30_cZC2lcSfJHLaAxcXoPTi5xP34GuLjwsJA1F-LTgzJfnMkQ8mlnrCeXTRaNfmMleOCoT817bXeCevbQun74RDEkV9scEDB7pIgl1csDL484j9D2nMOPSL7Ibj9g3X0hX28mmIC-qNDipSIQR8G-uDbXpiINa22bwk0_FqdU8Xznd3ajbua6pSDnyEvo8cnhCXS_CueyLCj2-gSyrPMbs.Lp-9QYDXAsP7VH_yx3ijqg"
// //   },
// //   {
// //       "domain": "chatgpt.com",
// //       "expirationDate": 1747788427.079814,
// //       "hostOnly": true,
// //       "httpOnly": true,
// //       "name": "__cflb",
// //       "path": "/",
// //       "sameSite": "no_restriction",
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "0H28vzvP5FJafnkHxj4UVne8VH4RU2xWYFEajAMQoKR"
// //   },
// //   {
// //       "domain": "chatgpt.com",
// //       "expirationDate": 1777958185.000293,
// //       "hostOnly": true,
// //       "httpOnly": false,
// //       "name": "oai-hlib",
// //       "path": "/",
// //       "sameSite": "lax",
// //       "secure": false,
// //       "session": false,
// //       "storeId": null,
// //       "value": "true"
// //   },
// //   {
// //       "domain": ".chatgpt.com",
// //       "expirationDate": 1750155010.3778,
// //       "hostOnly": false,
// //       "httpOnly": false,
// //       "name": "oai-last-model",
// //       "path": "/",
// //       "sameSite": "lax",
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "gpt-4-1"
// //   },
// //   {
// //       "domain": "chatgpt.com",
// //       "expirationDate": 1747787849,
// //       "hostOnly": true,
// //       "httpOnly": false,
// //       "name": "_dd_s",
// //       "path": "/",
// //       "sameSite": "strict",
// //       "secure": false,
// //       "session": false,
// //       "storeId": null,
// //       "value": "rum=0&expire=1747787834222&logs=1&id=ab633954-dd66-4596-a7d9-4488cbce8cdb&created=1747784828001"
// //   },
// //   {
// //       "domain": ".chatgpt.com",
// //       "expirationDate": 1778387660.810494,
// //       "hostOnly": false,
// //       "httpOnly": true,
// //       "name": "proxy_server",
// //       "path": "/",
// //       "sameSite": null,
// //       "secure": false,
// //       "session": false,
// //       "storeId": null,
// //       "value": "21"
// //   },
// //   {
// //       "domain": ".chatgpt.com",
// //       "expirationDate": 1777958185.000293,
// //       "hostOnly": false,
// //       "httpOnly": false,
// //       "name": "oai-hlib",
// //       "path": "/",
// //       "sameSite": "lax",
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "true"
// //   },
// //   {
// //       "domain": ".chatgpt.com",
// //       "expirationDate": 1747788732.839021,
// //       "hostOnly": false,
// //       "httpOnly": true,
// //       "name": "__cf_bm",
// //       "path": "/",
// //       "sameSite": "no_restriction",
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "6jmTw2kre.bg1WZNccp0BwV5pRZuoatxaTBfU6gkwOA-1747786932-1.0.1.1-OH5cNBR1CbmaxppgX_3btopdthpbJHJmkax4I3HK9E_7aF38SqW4Wc.c0Hoc_noqD2b601LDCBZoR9BUhcFnoVUh9fDbBXOfPCHjoP5OJEQ"
// //   },
// //   {
// //       "domain": ".chatgpt.com",
// //       "expirationDate": 1751594074,
// //       "hostOnly": false,
// //       "httpOnly": false,
// //       "name": "_gcl_au",
// //       "path": "/",
// //       "sameSite": null,
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "1.1.1444157229.1743818074"
// //   },
// //   {
// //       "domain": ".chatgpt.com",
// //       "expirationDate": 1759634609.834086,
// //       "hostOnly": false,
// //       "httpOnly": false,
// //       "name": "oai-cbs",
// //       "path": "/",
// //       "sameSite": null,
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "%2Fauth%2Flogin"
// //   },
// //   {
// //       "domain": "chatgpt.com",
// //       "hostOnly": true,
// //       "httpOnly": false,
// //       "name": "oai-hm",
// //       "path": "/",
// //       "sameSite": "lax",
// //       "secure": false,
// //       "session": true,
// //       "storeId": null,
// //       "value": "AGENDA_TODAY%20%7C%20ON_YOUR_MIND"
// //   },
// //   {
// //       "domain": ".chatgpt.com",
// //       "hostOnly": false,
// //       "httpOnly": true,
// //       "name": "_cfuvid",
// //       "path": "/",
// //       "sameSite": "no_restriction",
// //       "secure": true,
// //       "session": true,
// //       "storeId": null,
// //       "value": "yj.BKJTfHrxpP0jLro4CJvTYpMboBWG4j5OfP7wWdx4-1747752448260-0.0.1.1-604800000"
// //   },
// //   {
// //       "domain": "chatgpt.com",
// //       "expirationDate": 1750155010.3778,
// //       "hostOnly": true,
// //       "httpOnly": false,
// //       "name": "oai-last-model",
// //       "path": "/",
// //       "sameSite": "lax",
// //       "secure": false,
// //       "session": false,
// //       "storeId": null,
// //       "value": "gpt-4-1"
// //   },
// //   {
// //       "domain": ".chatgpt.com",
// //       "expirationDate": 1779322935.409045,
// //       "hostOnly": false,
// //       "httpOnly": false,
// //       "name": "oai-sc",
// //       "path": "/",
// //       "sameSite": "no_restriction",
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "0gAAAAABoLRy3YY1aTZaDAECQPeg0d8wQL4ZrSj1-CUVwkyZl6NyXlbnyRRWATWxzVPnbqPMp5EuwzfP9_UH0zA8xOsoyGp2CebJtvHrfDzhq8D3mCNnb9_L-Uvdwbt0deokU4Gu8HVM02RuxCNXDQkANWF6jMAoKEA7bCM9uWbnV7ujXyVSJ7z8n-irUXwsOfO3zwPNhcB8KiZNABZXAItptVNgbosGis3pEwrBJeXAUQgtZC68Xd84"
// //   },
// //   {
// //       "domain": "chatgpt.com",
// //       "expirationDate": 1755360450.541603,
// //       "hostOnly": true,
// //       "httpOnly": false,
// //       "name": "oai-sh-c-i",
// //       "path": "/",
// //       "sameSite": "lax",
// //       "secure": false,
// //       "session": false,
// //       "storeId": null,
// //       "value": "682a05a4-6a9c-8006-8d8c-c4a60ea092c9"
// //   },
// //   {
// //       "domain": "chatgpt.com",
// //       "hostOnly": true,
// //       "httpOnly": false,
// //       "name": "oai-gn",
// //       "path": "/",
// //       "sameSite": "lax",
// //       "secure": false,
// //       "session": true,
// //       "storeId": null,
// //       "value": "Suprime"
// //   },
// //   {
// //       "domain": "chatgpt.com",
// //       "expirationDate": 1747788518.611349,
// //       "hostOnly": true,
// //       "httpOnly": true,
// //       "name": "_uasid",
// //       "path": "/",
// //       "sameSite": "no_restriction",
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "\"Z0FBQUFBQm9MUnZlOWlQQU5FNnlVWTYtbktSdHlwVFVkWXlXMzZaUmZBYVNmcDUwWTRHRkxqS0hwRVJ4RGhQQ2p3Y0NLcXVhcUZhemRWT1JmSGswUlBiaktGZlA0eGtySk9RLUR5Vmpkem55UV80WEh3NG1qMHVfSUt1V05FNjNianRxVnkxaWNnYlU3T1UwWXRhZTdLV0xIYWJMZlZYSmtrbHNCMUlYRUJtME5IOVBIMVRDbENPTWVNZ0FKbG5JY3h2TlNONnVxNTZZWXhxY29LbGM0ZWVTYWUxUExseUtxRWU5SXp6ZGRWSHpvTFNJZDR3QWxjaTlSbGYybHVKSFE3d1ZDSUtfalFPbERod1hQMzU3N1h5aElpVGVjTzBuWWJtNHZmWm9FU3lSaHlVNTJ0OXQwTzJ5Qk40bWVoUW1KeFdOb2JjQ2tEbzB4Umk4ZlZlcU85N2RkYkJ1aEhQdWVRPT0=\""
// //   },
// //   {
// //       "domain": "chatgpt.com",
// //       "hostOnly": true,
// //       "httpOnly": true,
// //       "name": "__Host-next-auth.csrf-token",
// //       "path": "/",
// //       "sameSite": "lax",
// //       "secure": true,
// //       "session": true,
// //       "storeId": null,
// //       "value": "fbe438373927ed86fbca83ef6175b75e0ec59b748edbba19065bb05d3ff95f0a%7C7544e550632579ddfa2b8282f16c97a13d9779213bd46c24d438ed4dac4c00e4"
// //   },
// //   {
// //       "domain": "chatgpt.com",
// //       "hostOnly": true,
// //       "httpOnly": true,
// //       "name": "__Secure-next-auth.callback-url",
// //       "path": "/",
// //       "sameSite": "lax",
// //       "secure": true,
// //       "session": true,
// //       "storeId": null,
// //       "value": "https%3A%2F%2Fchatgpt.com"
// //   },
// //   {
// //       "domain": ".chatgpt.com",
// //       "expirationDate": 1750378921.219,
// //       "hostOnly": false,
// //       "httpOnly": true,
// //       "name": "__Secure-next-auth.callback-url",
// //       "path": "/",
// //       "sameSite": "lax",
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "https%3A%2F%2Fchatgpt.com"
// //   },
// //   {
// //       "domain": "chatgpt.com",
// //       "expirationDate": 1747788518.611841,
// //       "hostOnly": true,
// //       "httpOnly": true,
// //       "name": "_umsid",
// //       "path": "/",
// //       "sameSite": "no_restriction",
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "\"Z0FBQUFBQm9MUnZlSElWNUxCd2xyRzNVNVBnZ1Y4Q0hnUlluTWxfazZ0LTdlQ3A3TmF5Z19lNEgyYjJwVDE2Rmc3d1JNN2kwYzdHcllzWG9IRzNwTVY4d3UyYlhoX3ZDRktMZ0FZMDRZWjZTdXFaQ3haQjZ6MGExbWQ0dDlnWDlUb3UxbHBYMm9JbWRWdjhxa0huTlc1TFZ1VFlNejE0SkpVelVxdXF2S3kweTh0SkFodHN3TjFRWnBtSFcxNTZfck9taTVuX1FZbTVKcmJfSklPVk1OYjhHdGRYb2tGNmRYeHB2bTZZbUdkc0thXzlQODlQZm92az0=\""
// //   },
// //   {
// //       "domain": ".chatgpt.com",
// //       "expirationDate": 1778574897.075014,
// //       "hostOnly": false,
// //       "httpOnly": false,
// //       "name": "oai-allow-ne",
// //       "path": "/",
// //       "sameSite": null,
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "false"
// //   },
// //   {
// //       "domain": ".chatgpt.com",
// //       "expirationDate": 1772680923.058509,
// //       "hostOnly": false,
// //       "httpOnly": false,
// //       "name": "oai-did",
// //       "path": "/",
// //       "sameSite": null,
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "287f193a-4952-4be4-b54a-745687b7493c"
// //   },
// //   {
// //       "domain": ".chatgpt.com",
// //       "expirationDate": 1750378921.218,
// //       "hostOnly": false,
// //       "httpOnly": false,
// //       "name": "oai-gn",
// //       "path": "/",
// //       "sameSite": "lax",
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "Suprime"
// //   },
// //   {
// //       "domain": ".chatgpt.com",
// //       "expirationDate": 1750378921.217,
// //       "hostOnly": false,
// //       "httpOnly": false,
// //       "name": "oai-hm",
// //       "path": "/",
// //       "sameSite": "lax",
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "READY_WHEN_YOU_ARE%20%7C%20READY_WHEN_YOU_ARE"
// //   },
// //   {
// //       "domain": ".chatgpt.com",
// //       "expirationDate": 1777389105.255655,
// //       "hostOnly": false,
// //       "httpOnly": false,
// //       "name": "oai-nav-state",
// //       "path": "/",
// //       "sameSite": null,
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "1"
// //   },
// //   {
// //       "domain": ".chatgpt.com",
// //       "expirationDate": 1755360450.541603,
// //       "hostOnly": false,
// //       "httpOnly": false,
// //       "name": "oai-sh-c-i",
// //       "path": "/",
// //       "sameSite": "lax",
// //       "secure": true,
// //       "session": false,
// //       "storeId": null,
// //       "value": "682a05a4-6a9c-8006-8d8c-c4a60ea092c9"
// //   },
// //   {
// //       "domain": ".chatgpt.com",
// //       "expirationDate": 1778387660.527456,
// //       "hostOnly": false,
// //       "httpOnly": true,
// //       "name": "proxy_token",
// //       "path": "/",
// //       "sameSite": null,
// //       "secure": false,
// //       "session": false,
// //       "storeId": null,
// //       "value": "3679140ae5cca5325c6846092784d922"
// //   }
// // ]
// Master Tools BD Extension - Background Script
// This script handles the main functionality of the extension

// Listen for messages from the content script
const Browsers = Object.freeze({
  Any: 'any',
  Chrome: 'chrome',
  Edge: 'edge',
  Firefox: 'firefox',
  Opera: 'opera',
  Safari: 'safari',
});

const Env = {
  browserName: '@@browser_name',
};

function createEventEmitter() {
  const queue = {};

  function emit(event, ...params) {
    const listeners = queue[event];
    if (listeners) {
      listeners.forEach(callback => callback(...params));
    }
  }

  function on(event, callback) {
    if (!queue[event]) {
      queue[event] = [];
    }
    queue[event].push(callback);
  }

  return { emit, on };
}

function createBrowserDetector() {
  const namespace = window.chrome || window.browser;
  let supportPromises = false;
  let supportSidePanel = false;

  // Detect browser name dynamically
  if (typeof safari !== 'undefined' && safari.self) {
    Env.browserName = Browsers.Safari;
  } else if (typeof window.browser !== 'undefined') {
    Env.browserName = Browsers.Firefox;
  } else {
    Env.browserName = Browsers.Chrome;
  }

  try {
    supportPromises = namespace.runtime.getPlatformInfo() instanceof Promise;
    console.info('Promises support: ', supportPromises);
  } catch (e) {}

  try {
    supportSidePanel = typeof namespace.sidePanel !== 'undefined';
    console.info('SidePanel support: ', supportSidePanel);
  } catch (e) {}

  console.log(Env.browserName);

  return {
    getApi: () => namespace,
    supportsPromises: () => supportPromises,
    isSafari: () => Env.browserName === Browsers.Safari
  };
}

function createGenericCookieHandler(browserDetector) {
  const emitter = createEventEmitter();
  let cookies = [];
  let currentTab = null;

  function prepareCookie(cookie, url) {
    const newCookie = {
      domain: cookie.domain || '',
      name: cookie.name || '',
      value: cookie.value || '',
      path: cookie.path || null,
      secure: cookie.secure || null,
      httpOnly: cookie.httpOnly || null,
      expirationDate: cookie.expirationDate || null,
      storeId: cookie.storeId || (currentTab?.cookieStoreId || null),
      url: url,
    };

    if (browserDetector.isSafari()) {
      if (newCookie.domain) {
        const protocol = newCookie.secure ? 'https://' : 'http://';
        newCookie.url = protocol + newCookie.domain;
      }
      if (!newCookie.path) {
        newCookie.path = '/';
      }
    }

    if (cookie.hostOnly || (browserDetector.isSafari() && !newCookie.domain)) {
      newCookie.domain = null;
    }

    if (!browserDetector.isSafari()) {
      newCookie.sameSite = cookie.sameSite || undefined;
      if (newCookie.sameSite === 'no_restriction') {
        newCookie.secure = true;
      }
    }

    return newCookie;
  }

  function saveCookie(cookie, url, callback) {
    const preparedCookie = prepareCookie(cookie, url);
    const api = browserDetector.getApi();

    if (browserDetector.supportsPromises()) {
      api.cookies.set(preparedCookie)
        .then(savedCookie => callback(null, savedCookie))
        .catch(error => {
          console.error('Failed to create cookie', error);
          callback(error.message, null);
        });
    } else {
      api.cookies.set(preparedCookie, (cookieResponse) => {
        const error = api.runtime.lastError;
        error ? callback(error.message, null) : callback(null, cookieResponse);
      });
    }
  }

  function removeCookie(name, url, callback, isRecursive = false) {
    const api = browserDetector.getApi();

    if (browserDetector.isSafari() && !isRecursive) {
      getAllCookiesInBrowser((cookies) => {
        cookies.filter(c => c.name === name).forEach(cookie => {
          const cookieUrl = `http${cookie.secure ? 's' : ''}://${cookie.domain}`;
          removeCookie(name, cookieUrl, callback, true);
        });
      });
    } else if (browserDetector.supportsPromises()) {
      api.cookies.remove({
        name,
        url,
        storeId: currentTab?.cookieStoreId || null,
      })
        .then(result => callback(null, result))
        .catch(error => callback(error.message, null));
    } else {
      api.cookies.remove({
        name,
        url,
        storeId: currentTab?.cookieStoreId || null,
      }, (cookieResponse) => {
        const error = api.runtime.lastError;
        error ? callback(error.message, null) : callback(null, cookieResponse);
      });
    }
  }

  function getAllCookiesInBrowser(callback) {
    const api = browserDetector.getApi();

    if (browserDetector.supportsPromises()) {
      api.cookies.getAll({})
        .then(callback)
        .catch(error => callback([], error));
    } else {
      api.cookies.getAll({}, callback);
    }
  }

  return {
    ...emitter,
    saveCookie,
    removeCookie,
    getAllCookiesInBrowser,
    setCurrentTab: (tab) => { currentTab = tab; }
  };
}

// Initialize the browser detector and cookie handler

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === "SET_COOKIES") {
    const { domain, cookieData } = message.payload;
    
    try {
      console.log("Setting cookies for domain:", domain);
      const browserDetector = createBrowserDetector();
const cookieHandler = createGenericCookieHandler(browserDetector);
      // Parse the cookie data
      const cookies = JSON.parse(cookieData);
      
      // Set each cookie using the saveCookie method
      const cookiePromises = cookies.map(cookie => {
        return new Promise((resolve, reject) => {
          cookieHandler.saveCookie(cookie, `https://${cookie.domain}`, (error, cookieResponse) => {
            if (error) {
              reject(`Error setting cookie: ${error}`);
            } else {
              resolve(cookieResponse);
            }
          });
        });
      });
      
      Promise.all(cookiePromises)
        .then(() => {
          console.log("All cookies set successfully, opening domain:", domain);
          // After setting all cookies, open the domain in a new tab
          chrome.tabs.create({ url: `https://${domain}` });
          
          // Increment the cookie count
          chrome.storage.local.get(['cookieCount'], function(result) {
            const count = (result.cookieCount || 0) + 1;
            chrome.storage.local.set({ cookieCount: count });
            console.log("Cookie count incremented to:", count);
          });
          
          sendResponse({ success: true });
        })
        .catch(error => {
          console.error('Error setting cookies:', error);
          sendResponse({ success: false, error: error });
        });
    } catch (error) {
      console.error('Error processing cookies:', error);
      sendResponse({ success: false, error: error.message });
    }
    
    return true; // Keep the message channel open for the async response
  }

  // Handle the new platform access API
  if (message.type === "ACCESS") {
    const { platform, token, platformData } = message.payload;
    
    try {
      console.log("Accessing platform:", platform);
      
      // If platformData is already provided, use it directly
      if (platformData) {
        processPlatformData(platformData, sendResponse);
      } else {
        fetchPlatformData(platform, token)
          .then(data => processPlatformData(data, sendResponse))
          .catch(error => {
            console.error('Error fetching platform data:', error);
            sendResponse({ success: false, error: error.message });
          });
      }
    } catch (error) {
      console.error('Error processing platform access:', error);
      sendResponse({ success: false, error: error.message });
    }
    
    return true; // Keep the message channel open for the async response
  }
});

// Fetch platform data from the API
async function fetchPlatformData(platform, token) {
  const apiUrl = `https://tbd.secureguardwave.com/api/cookies/latest?platform=${platform}`;
  
  const response = await fetch(apiUrl, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication expired. Please log in again.');
    }
    throw new Error(`API error: ${response.status}`);
  }
  
  return await response.json();
}

// Process platform data to set cookies and open a domain
async function processPlatformData(data, sendResponse) {
  try {
    const { domain, redirect, cookies } = data;
    console.log(redirect, domain);
    
    // Set each cookie using the saveCookie method
    // for (const cookie of cookies) {
    //   await new Promise((resolve, reject) => {
    //     cookieHandler.saveCookie(cookie, `https://${cookie.domain}`, (error, cookieResponse) => {
    //       if (error) {
    //         reject(`Error setting cookie: ${error}`);
    //       } else {
    //         resolve(cookieResponse);
    //       }
    //     });
    //   });
    // }
    
    // Open the domain in a new tab
    chrome.tabs.create({ url: redirect || `https://${domain}` });
    
    // Increment access count
    chrome.storage.local.get(['accessCount'], function(result) {
      const count = (result.accessCount || 0) + 1;
      chrome.storage.local.set({ accessCount: count });
      console.log("Access count incremented to:", count);
    });
    
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error processing platform data:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Extension installation handler
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === "install") {
    console.log("Extension installed! Opening welcome page");
    chrome.tabs.create({
      url: "welcome.html"
    });
  } else if (details.reason === "update") {
    console.log("Extension updated");
  }
});

// Add browser action click handler
chrome.action.onClicked.addListener(function(tab) {
  console.log("Extension icon clicked");
  chrome.tabs.sendMessage(tab.id, { type: "EXTENSION_ACTIVATED" });
});

console.log("Background script loaded");
