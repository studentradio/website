import GhostContentAPI from "@tryghost/content-api";

// Create API instance with site credentials
const ghostClient = new GhostContentAPI({
  url: "https://studentradio.org.uk",
  key: "6fcda19bc05ccb44f93f2f8318",
  version: "v5.0",
});

export default ghostClient;
