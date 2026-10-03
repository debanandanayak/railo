import { btoa } from "node:buffer";
import crypto from "crypto-js";

export interface BookingInquiry {
  concessionBooking: boolean;
  srcStn: string;
  destStn: string;
  jrnyClass: string;
  jrnyDate: string;
  quotaCode: string;
  currentBooking: string;
  flexiFlag: boolean;
  handicapFlag: boolean;
  ticketType: string;
  loyaltyRedemptionBooking: boolean;
  ftBooking: boolean;
}

export function train() {
  const baseUrl = "https://www.irctc.co.in/eticketing/protected/mapps1";

  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
    greq: "1789611202655:0b9bba53-b5da-458c-b294-88c41a2b5fbc",
  };
  return {
    async getLiveStatus(body: { trainNumber: string; journeyDate: string }) {
      const response = await fetch(`${baseUrl}/ntesData`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const result = await response.json();
      return result;
    },

    async getTrainsByRoute(body: BookingInquiry) {
      const response = await fetch(`${baseUrl}/altAvlEnq/TC`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        return await response.json();
      }

      return {
        status: response.status,
        statusMessage: response.statusText,
      };
    },

    async pnrInquiry(pnr: string) {
      if (pnr.length !== 10) {
        throw Error("Invalid PNR number");
      }
      const response = await fetch(`${baseUrl}/pnrenq/${pnr}?pnrEnqType=E`, {
        method: "POST",
        headers,
      });
      const result = await response.json();
      return result;
    },

    async getStations() {
      const headers = {
        // "accept-language": "en-US,en;q=0.9",
        // "pragma": "no-cache",
        // "dnt": "1",
        // "sec-ch-ua": '"Chromium";v="152", "Not?A_Brand";v="24", "Google Chrome";v="152"',
        // "sec-ch-ua-mobile": "?0",
        // "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "document",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
      };
      const response = await fetch(`${baseUrl}/stationData`, {
        method: "GET",
        headers,
      });
      const result = await response.json();
      return result;
    },

    async getTrains() {
      const headers = {
        "sec-fetch-dest": "document",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
      };

      const response = await fetch(
        `https://www.irctc.co.in/eticketing/trainList`,
        {
          method: "GET",
          headers,
        },
      );
      const result = await response.text();

      return result;
    },

    async authenticate() {
      const authUrl = "https://www.irctc.co.in/authprovider/webtoken";
      const password = "Somename";
      const userId = "SomePassword";
      const asciiPassword = btoa(password);
      const serverId = "3d247a6e-02dc-4628-8485-20474136d42f";

      const currrentTime = "1790384784164";
      const uid = `${currrentTime}:${serverId}`;

      const wordStr = ("NA" + uid + "AAAAAAAAAAAAAAAA").substring(0, 16);
      const words = crypto.enc.Utf8.parse(wordStr);
      const text = `${userId}#UP#${asciiPassword}#UP#${currrentTime}`;

      const data = crypto.AES.encrypt(text, words, { iv: words }).toString();
      // const decrypt = crypto.AES.decrypt(data, words, { iv: words })

      const formData = new FormData();
      formData.append("grant_type", "password");
      formData.append("data", data.toString());
      formData.append("captcha", "NA");
      formData.append("uid", uid);
      formData.append("otpLogin", "false");
      formData.append("encodedPwd", "true");

      const response = await fetch(authUrl, {
        method: "POST",
        headers: {
          "user-agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36",
        },
        body: new URLSearchParams({
          grant_type: "password",
          data: data,
          captcha: "NA",
          uid: uid,
          otpLogin: "false",
          encodedPwd: "true",
        }),
      });

      if (response.status === 200) {
        const result = await response.json();
        return result;
      } else {
        return response.statusText;
      }
    },
  };
}
