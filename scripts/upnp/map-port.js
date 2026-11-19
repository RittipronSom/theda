const { createClient } = require("nat-upnp");

const client = createClient();

const portMapping = (opts) =>
  new Promise((resolve, reject) => client.portMapping(opts, (err) => (err ? reject(err) : resolve())));
const getMappings = () =>
  new Promise((resolve, reject) => client.getMappings((err, list) => (err ? reject(err) : resolve(list))));

async function main() {
  try {
    await portMapping({
      public: 3000,
      private: 3000,
      ttl: 0,
      description: "thedaEcom web 3000",
      protocol: "TCP",
    });
    console.log("MAPPING_OK");
    const list = await getMappings();
    for (const m of list) {
      console.log("ACTIVE:", JSON.stringify({ public: m.public, private: m.private, description: m.description, protocol: m.protocol }));
    }
  } catch (err) {
    console.error("MAPPING_FAILED:", err.message || err);
    process.exitCode = 1;
  } finally {
    client.close();
  }
}

main();
