let plccode = {};


const uploadCode = (req, res) => {
  const { code } = req.body;
  console.log('Uploaded in server',code);
  if (code != null) {
    plccode = code;
    return res.json({ message: "Uploaded", data: req.body });
  }
  res.json({ message: "code not found" });
};

const getCode = (req, res) => {
  res.json(plccode);
}
module.exports = { getCode, uploadCode };
