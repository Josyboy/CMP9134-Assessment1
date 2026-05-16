export default async function fetch() {
  return {
    json: async () => ({}),
    ok: true,
    status: 200,
    text: async () => "",
  };
}