const axios = require("axios");

module.exports = async (req, res) => {
  const ids = req.query.ids.split(",");
  const allData = (
    await Promise.all(
      ids.map((id) => {
        return axios.get(
          `https://esc.eng.chula.ac.th/or64/page-data/detail/${id}/page-data.json`
        );
      })
    )
  ).map(({ data }) => ({
    student: data.result.data.studentsJson.name,
    section: data.result.data.allSectionsJson.edges,
  }));

  let allSec = [];

  allData.map(({ student, section }) => {
    section.map(({ node }) => {
      const founded = allSec.find(
        (sec) => sec.code == node.code && sec.section == node.section
      );
      if (!founded) {
        allSec.push({
          code: node.code,
          name: node.name,
          section: node.section,
          participants: [],
        });
      }
    });
  });

  allData.map(({ student, section }) => {
    section.map(({ node }) => {
      const i = allSec.findIndex(
        (sec) => sec.code == node.code && sec.section == node.section
      );
      if (i < allSec.length) allSec[i].participants.push(student);
    });
  });

  res.send(allSec);
};
