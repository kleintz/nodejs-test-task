const parseBody = (body) => {
  let bodyObj
  try {
    bodyObj = JSON.parse(body)
  } catch {
    bodyObj = null
  }
  return bodyObj
}

const constructResponse = (res) => {
  res = typeof res === 'string' ? { error: res } : res
  return JSON.stringify(res)
}

module.exports = {
  parseBody,
  constructResponse
}
