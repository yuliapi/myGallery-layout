const content = 'Has eu debitis delicata deterruisset. Nec veniam audiam ut. Utroque commune accumsan eihis, in mei mandamus recteque petentium! Mundi nemore an vel, persius veritus perfectovis te. Enim doming ius cu. Sea ponderum suavitate consequuntur ex, has latine aperiam neglegentur ne. Ei iriure principes consulatu est, tollit suscipit mea at, eu alii constituam eam! Eruditiefficiendi cu eam, alterum mentitum salutatus an per, eu sed facer labores. Vis dicamaperiam bonorum an, qui luptatum ocurreret id nibh harum ancillae sea eu. Nec id proboomnesque, apeirian erroribus signiferumque sea te.';

const colors = ['red', 'blue', 'green', 'orange', 'purple', null, null, null];

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('notes').del()
    .then(function () {
      // Inserts seed entries
      console.log(content.split(' ').length);

      let data = [];
      for (let j = 0; j < 100; j++) {
        let words = content.replace('[\,\.]+', '').split(' ');
        let headerRand = [];
        for(let i = 0; i <= Math.floor(Math.random() * 6); i++) {
          headerRand.push(words[Math.floor(Math.random() * words.length)]);
        }
        let bodyRand = [];
        for(let i = 0; i <= 200 + Math.ceil(Math.random() * 200); i++) {
          bodyRand.push(words[Math.floor(Math.random() * words.length)]);
        }
        let colorRand = colors[Math.floor(Math.random() * colors.length)];
        data.push({header: headerRand.join(' '), body: bodyRand.join(' '), photo: colorRand});
        // console.log(`Header: ${header.join(' ')}`);
        //console.log(`Body: ${body.join(' ')}`);
        // console.log(colors[Math.floor(Math.random() * colors.length)])
      }
      return knex('notes').insert(data);
    });
};
