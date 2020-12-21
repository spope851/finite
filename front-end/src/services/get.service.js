
const get = async (endpoint) => {
  const response = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/${endpoint}`);
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
  return body;
}

export default get