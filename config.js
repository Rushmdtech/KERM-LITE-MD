const { Sequelize } = require('sequelize');
const fs = require('fs');

if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env', override: true });

const convertToBool = (text, fault = 'true') => text === fault;
const toBool = (x) => (x && x.toLowerCase() === 'true') || false;

global.apikey = { 'https://api.adithyan.xyz': 'free' };
global.apiUrl = 'https://hermit-api.koyeb.app/';

const DATABASE_URL = process.env.DATABASE_URL || './database.db';
process.env.NODE_OPTIONS = '--max_old_space_size=2560';

const DEBUG = convertToBool(process.env.DEBUG, 'true');

module.exports = {
  VERSION: 'v4.4.4',
  SESSION_ID: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRUtEdmxmK1dKeEhCWk15WDFzSHpHZEZTRFh2Rkx4WThxWE43RmpTSk9Gaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaDcrSFF5a1FCUWxUNW1UQ0NsU0hOTk44anFxRXZDS3c0cGs1cEdoRWd4cz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJBS0gvb3BINXhiUFJyZXE5UXlvTkhiY3lEVk9xWUI0OWtrN3Uwa2NEM0VJPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIxODZPWEFyV001ck9HUWhsYlNSSGRzUlNrYXdMOGpNbG5salFSRVpNWW44PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjBJRFBaNVpkcHJrU3dwVytCV3h1ekJJcGRxdWkzb2xZdHdzb2l4QUwwazg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ijh3STVQV2RKbXoramdrKy9qMHB5dXN6QXNDc05PQlZVMnBTcUdRYm94Qjg9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0lyKyttTlBud1YydVBiWDlOVFNwNmpYeXRidVQzbG44RG0vMEVDajAyOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVUtRSzNVZUhrTzlSZFQzajJvTDFCbUdaWXpNSGExbVJEbERrbXhXQnFCOD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkV2NFF2WFhOQjFNalFjdXFiUVo4U2JSaDhKZlQyUEl1K0taak9sbisyd0pCWkMxcGgwTE00akwwOEh0ZjJvM0RYNEVEU0xmaHhZcE1jTm1hM0pDbGlBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTc1LCJhZHZTZWNyZXRLZXkiOiJka1ZsR2pzYXFoUnpML3pzUXBaT0FFdlZsNy9hTTJ5N1V1bVgwajJKb3hrPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiItLVhNQTNCNVRwYWMtcTVzQzE3YXNRIiwicGhvbmVJZCI6IjAwOWJlNjljLWFlN2UtNGU4OC1iYmI0LTA3ZWE0NzJjZjQxNSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJncDI4clBNaHpCaWlVa2lHTXFIU2pkV1U3QzA9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMkdyT1YyT3F2NStXbG1TakhNbTViRFFEWE9BPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkRXSzhNSk1DIiwibWUiOnsiaWQiOiI5NDc2MjQ5ODUxOTo3NkBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDUGlmeTk0R0VMV1R1cllHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiOGQ3RE1YNDZCT0pYZHo3TG9UdHNqZ052UGhKL1RHZzVjWGhsajVBOUgzRT0iLCJhY2NvdW50U2lnbmF0dXJlIjoib3NNdkQyZmFmakl2dXkxWHY3OFlyZnp3VWVOV2I4a1h5WllFdWluY3EwVUJWL1lhM0thZEVtdk1mYnpKVms1elZKQjdScjlBdFhnTFd5OEl1VDdnQ0E9PSIsImRldmljZVNpZ25hdHVyZSI6IjZXcW5hUmRkb2Nvb1ZsVFZ1aDBUWk4yZkVNK2lsMVc0L1c5L0FYUHUvMVYrK24xUzVoY1R5Q25tTjBhVThPaG5XRmlrOHJRcTRLdmQ4Q09tN2JncmhBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTQ3NjI0OTg1MTk6NzZAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCZkhld3pGK09nVGlWM2MreTZFN2JJNERiejRTZjB4b09YRjRaWStRUFI5eCJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyNDgxMTcxNH0=',
  MODE: (process.env.MODE || 'private').toLowerCase(),
  HANDLERS: (process.env.PREFIX || '^[.,!]').trim(),
  SEND_READ: toBool(process.env.READ_COMMAND),
  READ_MSG: toBool(process.env.READ_MSG),
  MSG_LOG: convertToBool(process.env.LOG_MSG),
  BLOCKCHAT: process.env.BLOCK_CHAT || false,
  LANG: (process.env.LANGUAGE || 'EN').toUpperCase(),
  ALWAYS_ONLINE: toBool(process.env.ALWAYS_ONLINE),
  BOT_NAME: process.env.BOT_NAME || 'ʜᴇʀᴍɪᴛ',
  AUTOMUTE_MSG: process.env.AUTOMUTE_MSG || '_Group automuted!_\n_(Change this by setting var AUTOMUTE_MSG)_',
  AUTOUNMUTE_MSG: process.env.AUTOUNMUTE_MSG || '_Group autounmuted!_\n_(Change this by setting var AUTOUNMUTE_MSG)_',
  ANTILINK_MSG: process.env.ANTILINK_MSG || '_Link Not Allowed!_\n_(Change this by setting var ANTILINK_MSG)_',
  BOT_INFO: process.env.BOT_INFO || 'ʜᴇʀᴍɪᴛ;ᴀᴅɪᴛʜyᴀɴ;972528277755;https://i.imgur.com/6oRG106.jpeg',
  AUDIO_DATA: process.env.AUDIO_DATA || 'ʜᴇʀᴍɪᴛ;ᴀᴅɪᴛʜyᴀɴ;https://i.imgur.com/fj2WE83.jpeg',
  STICKER_DATA: process.env.STICKER_DATA || 'ʜᴇʀᴍɪᴛ;ᴀᴅɪᴛʜyᴀɴ',
  ERROR_MESSAGE: toBool(process.env.ERROR_MESSAGE, 'true'),
  SONG_THUMBNAIL: toBool(process.env.SONG_THUMBNAIL),
  WARN: process.env.WARN || '4',
  REJECT_CALL: toBool(process.env.REJECT_CALL),
  KOYEB_API_KEY: process.env.KOYEB_API_KEY || false,
  KOYEB_APP_NAME: process.env.KOYEB_APP_NAME || '',
  RENDER_API: process.env.RENDER_API || false,
  RENDER_NAME: process.env.RENDER_NAME || '',
  TERMUX_VPS: toBool(process.env.TERMUX || process.env.VPS),
  AUTO_STATUS_VIEW: toBool(process.env.AUTO_STATUS_VIEW),
  APIKEY: process.env.APIKEY || 'free',
  AUTH_FILE: process.env.AUTH_FILE || false,
  START_MSG: toBool(process.env.START_MSG || 'true'),
  DATABASE_URL: DATABASE_URL,
  DATABASE: DATABASE_URL === './database.db' 
    ? new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_URL,
        logging: false,
      }) 
    : new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
          native: true,
          ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
      }),
  RBG_API_KEY: process.env.REMOVE_BG_API_KEY || false,
  BRAIN_ID: process.env.BRAIN_ID || 'bid=168613&key=EfbnX54Iy9PFIFp3',
  SUDO: process.env.SUDO || '0,0',
  DEBUG: DEBUG
};
