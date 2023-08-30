const biomeService = {
  biome: async (body) => {
    body = JSON.stringify(body);
    const headers = {
      // 'Authorization': renderAuthBearer(),
      'Content-Type': 'application/json',
      // 'content-type': 'application/octet-stream'
      // 'content-length': CHUNK.length,
    };
    return await serviceRequest('/biome', {
      method: 'POST',
      headers,
      body,
      log: true,
    });
  },
};
